const FileReader = require('../infrastructure/external_services/file-reader');
const DropboxClient = require('../infrastructure/external_services/dropbox-client');
const mailJet = require('../infrastructure/mailing/mailjet');
const config = require('../infrastructure/config');
const { isEmpty, flatten } = require('lodash');
const articleRepository = require('../domain/repositories/article-repository');
const chapterRepository = require('../domain/repositories/chapter-repository');
const photoRepository = require('../domain/repositories/photo-repository');
const subscriptionRepository = require('../domain/repositories/subscription-repository');
const articlesChangedEmailFrTemplate = require('../infrastructure/mailing/articles-changed-email-fr-template');
const articlesChangedEmailEnTemplate = require('../infrastructure/mailing/articles-changed-email-en-template');

async function synchronizeArticles() {
  const dropboxFiles = await DropboxClient.getAllDropboxFoldersMetadatas();
  const freshArticles = _serializeArticles(dropboxFiles);
  const report = await _compareDropboxAndDatabaseArticles(freshArticles);
  const articlesToReport = await _ifArticlesChangesThenUpdateArticlesInDatabase(report, dropboxFiles);
  return _ifArticlesChangedThenSendEmailToRecipients(articlesToReport);
}

function _serializeArticles(metadatas) {
  const imageZeros = metadatas
    .map(fileMetadata => fileMetadata.path_display)
    .filter(path => path.match('0.jpg$'));
  return metadatas
    .filter(metadata => metadata['.tag'] === 'folder')
    .map((metadata) => {
      const imgPath = imageZeros.filter(img => img.match(`^/${metadata.name}`))[0];
      return ({
        dropboxId: metadata.name,
        imgPath,
        galleryPath: `/${metadata.name}`,
      });
    });
}

function _compareDropboxAndDatabaseArticles(freshArticles) {
  return articleRepository.getAll()
    .then((oldArticles) => {
      const addedArticles = freshArticles.reduce((accumulatedArticles, freshArticle) => {
        const matchedArticles = oldArticles.filter(({ dropboxId }) => dropboxId === freshArticle.dropboxId);
        if (matchedArticles.length === 0) {
          accumulatedArticles.push(freshArticle);
        }
        return accumulatedArticles;
      }, []);
      const hasChanges = !isEmpty(addedArticles);
      return { addedArticles, hasChanges };
    });
}

function _ifArticlesChangedThenSendEmailToRecipients(report) {
  const result = report;
  if (report.hasChanges) {
    return subscriptionRepository.getAll()
      .then((subscriptions) => {
        result.receivers = subscriptions;
        return result;
      })
      .then(form => _sendArticlesChangedEmail(form))
      .then(() => result);
  }
  return report;
}

function _sendArticlesChangedEmail(form) {
  const { receivers } = form;
  const templateFr = articlesChangedEmailFrTemplate.compile(form);
  const templateEn = articlesChangedEmailEnTemplate.compile(form);

  const optionsFr = {
    from: config.MAIL_FROM,
    fromName: 'RecontactMe',
    to: receivers.filter(({ lang }) => lang === 'fr-Fr').map(({ email }) => email),
    subject: '[RecontactMe] Il y a du nouveau sur le site !',
    template: templateFr,
  };
  const optionsEn = {
    from: config.MAIL_FROM,
    fromName: 'RecontactMe',
    to: receivers.filter(({ lang }) => lang !== 'fr-Fr').map(({ email }) => email),
    subject: '[RecontactMe] Some news on the website !',
    template: templateEn,
  };
  return Promise.all([mailJet.sendEmail(optionsFr), mailJet.sendEmail(optionsEn)]);
}

function _ifArticlesChangesThenUpdateArticlesInDatabase(report, dropboxFiles) {
  if (report.hasChanges) {
    return _createArticlesInDatabase(report)
      .then(() => _insertArticlesContentsInDatabase(report, dropboxFiles))
      .then(articlesToReport => _createPhotosOfArticlesInDatabase(articlesToReport));
  }
  return report;
}

function _createPhotosOfArticlesInDatabase(report) {
  const allPhotosOfAllArticles = report.addedArticles.reduce((promises, article) => {
    const photosOfArticle = getPhotosOfArticle(article);
    promises.push(photosOfArticle);
    return promises;
  }, []);
  return Promise.all(allPhotosOfAllArticles)
    .then(photos => flatten(photos))
    .then(photos => photoRepository.createPhotos(photos))
    .then(() => report);
}

function getPhotosOfArticle({ dropboxId }) {
  return DropboxClient.getFilesFolderPaths(dropboxId)
    .then(paths => filterOnlyGalleryPhotos(paths))
    .then(paths => createPhotoOfArticle(paths, dropboxId));
}

function filterOnlyGalleryPhotos(paths) {
  const photosPaths = paths.filter((path) => {
    const extension = path.split('.').pop();
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png';
  });
  return photosPaths.filter((path) => {
    const shortName = path.split('/').pop().substring(0, 3);
    return !shortName.match('[iI]mg');
  });
}

function createPhotoOfArticle(paths, dropboxId) {
  const allImgLinks = paths.reduce((promises, path) => {
    const imgLink = serializePhoto(path, dropboxId);
    promises.push(imgLink);
    return promises;
  }, []);
  return Promise.all(allImgLinks);
}

function serializePhoto(path, dropboxId) {
  return DropboxClient.createSharedLink(path)
    .then(response => ({
      imgLink: _transformToImgLink(response),
      dropboxId,
    }));
}

function _createArticlesInDatabase({ addedArticles }) {
  return _shareImagesZeros(addedArticles)
    .then(articles => articleRepository.create(articles));
}

function _shareImagesZeros(articles) {
  const articlesWithAll = articles.reduce((promises, article) => {
    const articleWithAll = _shareImageZero(article);
    promises.push(articleWithAll);
    return promises;
  }, []);
  return Promise.all(articlesWithAll);
}

function _shareImageZero(article) {
  return Promise.all([
    DropboxClient.createSharedLink(article.imgPath),
    DropboxClient.createSharedLink(article.galleryPath),
  ])
    .then(responses => ({
      dropboxId: article.dropboxId,
      imgLink: _transformToImgLink(responses[0]),
      galleryLink: _getGalleryUrl(responses[1]),
    }));
}

function insertTitleInReport(report, articlesContents) {
  const result = report;
  result.addedArticles.map((article) => {
    const articleWithTitle = article;
    const correctArticleInfo = articlesContents.filter(articleInfo => articleInfo.dropboxId === article.dropboxId);
    articleWithTitle.frTitle = correctArticleInfo[0].frTitle;
    articleWithTitle.enTitle = correctArticleInfo[0].enTitle;
    return articleWithTitle;
  });
  return result;
}

function _insertArticlesContentsInDatabase(report, dropboxFiles) {
  let result;
  const allChaptersToSave = report.addedArticles.reduce((promises, article) => {
    const chaptersToSave = _updateTitleAndExtractChaptersFromArticleContent(article, dropboxFiles);
    promises.push(chaptersToSave);
    return promises;
  }, []);
  return Promise.all(allChaptersToSave)
    .then((articlesContents) => {
      result = insertTitleInReport(report, articlesContents);
      return articlesContents.map(({ chapters }) => chapters);
    })
    .then(allChapters => flatten(allChapters))
    .then(chapters => chapterRepository.createArticleChapters(chapters))
    .then(() => result);
}

function _updateTitleAndExtractChaptersFromArticleContent(article, dropboxFiles) {
  const dropboxId = article.dropboxId;
  return Promise.all([
    DropboxClient.getFrTextFileStream(dropboxId),
    DropboxClient.getEnTextFileStream(dropboxId),
  ])
    .then(files => Promise.all([
      FileReader.read(files[0]),
      FileReader.read(files[1]),
    ]))
    .then(articleContents => _serializeArticleContents(articleContents, dropboxId, dropboxFiles))
    .then(articleInfos => _updateArticleTitles(articleInfos, dropboxId))
    .then(articleInfos => _shareChapterImages(articleInfos));
}

function _updateArticleTitles(articleInfos, dropboxId) {
  const { frTitle, enTitle } = articleInfos;
  articleRepository.update({ frTitle, enTitle }, dropboxId);
  return articleInfos;
}

function _serializeArticleContents(rawArticles, dropboxId, dropboxFiles) {
  const cuttedArticles = rawArticles.map(rawArticle => rawArticle
    .split('*')
    .map(row => row.trim()));

  const chapters = _generateChapters(cuttedArticles, dropboxId, dropboxFiles);

  return {
    frTitle: cuttedArticles[0][0],
    enTitle: cuttedArticles[1][0],
    chapters,
    dropboxId,
  };
}

function _generateChapters(cuttedArticles, dropboxId, dropboxFiles) {
  const chapterImagesPath = dropboxFiles.map(img => img.path_display);
  const frenchArticle = cuttedArticles[0];
  const englishArticle = cuttedArticles[1];
  const chapters = [];
  for (let i = 1; i < frenchArticle.length / 3; i += 1) {
    const imgLink = chapterImagesPath.filter(imgPath => imgPath.match(`/${dropboxId}/[iI]mg-?${i}.jpg$`))[0];
    const frenchTitle = frenchArticle[(3 * i) - 2];
    const frenchSubtitle = frenchArticle[(3 * i) - 1];
    const englishTitle = englishArticle[(3 * i) - 2];
    const englishSubtitle = englishArticle[(3 * i) - 1];
    chapters[i - 1] = {
      dropboxId,
      frTitle: [frenchTitle, frenchSubtitle].join(' ').trim(),
      enTitle: [englishTitle, englishSubtitle].join(' ').trim(),
      imgLink,
      frText: frenchArticle[3 * i],
      enText: englishArticle[3 * i],
    };
  }
  return chapters;
}

function _shareChapterImages(articleInfos) {
  const chaptersWithSharableLink = articleInfos.chapters.reduce((promises, chapter) => {
    if (isEmpty(chapter.imgLink)) {
      console.error('Problème avec les données fournies dans cet article : ');
      console.error(chapter);
      return promises;
    }
    const promise = _shareChapterImage(chapter.imgLink);
    promises.push(promise);
    return promises;
  }, []);
  return Promise.all(chaptersWithSharableLink)
    .then((imgLinks) => {
      const newArticleInfos = articleInfos;
      for (let i = 0; i < imgLinks.length; i += 1) {
        newArticleInfos.chapters[i].imgLink = imgLinks[i];
      }
      return newArticleInfos;
    });
}

function _shareChapterImage(imgLink) {
  return DropboxClient.createSharedLink(imgLink)
    .then(_transformToImgLink);
}

function _transformToImgLink(response) {
  return isEmpty(response) ? '' : response.url.replace(/.$/, '1');
}

function _getGalleryUrl(response) {
  return isEmpty(response) ? '' : response.url;
}
module.exports = {
  synchronizeArticles,
};
