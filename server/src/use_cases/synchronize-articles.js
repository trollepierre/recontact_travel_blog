const FileReader = require('../infrastructure/external_services/file-reader');
const DropboxClient = require('../infrastructure/external_services/dropbox-client');
const mailJet = require('../infrastructure/mailing/mailjet');
const config = require('../infrastructure/config');
const { isEmpty, flatten } = require('lodash');
const articleRepository = require('../domain/repositories/article-repository');
const chapterRepository = require('../domain/repositories/chapter-repository');
const photoRepository = require('../domain/repositories/photo-repository');
const subscriptionRepository = require('../domain/repositories/subscription-repository');
const articlesChangedEmailTemplate = require('../infrastructure/mailing/articles-changed-email-template');

function synchronizeArticles() {
  return DropboxClient.getAllDropboxFoldersMetadatas()
    .then(_serializeArticles)
    .then(_compareDropboxAndDatabaseArticles)
    .then(_ifArticlesChangesThenUpdateArticlesInDatabase)
    .then(_ifArticlesChangedThenSendEmailToRecipients);
}

function _serializeArticles(metadatas) {
  return metadatas
    .map(metadata => ({
      dropboxId: metadata.name,
      imgPath: `/${metadata.name}/img0.jpg`,
      galleryPath: `/${metadata.name}`,
    }));
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
        result.receivers = subscriptions.map(({ email }) => email);
        return result;
      })
      .then(form => _sendArticlesChangedEmail(form))
      .then(() => result);
  }
  return report;
}

function _sendArticlesChangedEmail(form) {
  const { receivers } = form;
  const template = articlesChangedEmailTemplate.compile(form);

  const options = {
    from: config.MAIL_FROM,
    fromName: 'RecontactMe',
    to: receivers,
    subject: '[RecontactMe] Il y a du nouveau sur le site !',
    template,
  };
  return mailJet.sendEmail(options);
}

function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
  if (report.hasChanges) {
    return _createArticlesInDatabase(report)
      .then(() => _insertArticlesContentsInDatabase(report))
      .then(() => _createPhotosOfArticlesInDatabase(report))
      .then(() => report);
  }
  return report;
}

function _createPhotosOfArticlesInDatabase({ addedArticles }) {
  const allPhotosOfAllArticles = addedArticles.reduce((promises, article) => {
    const photosOfArticle = getPhotosOfArticle(article);
    promises.push(photosOfArticle);
    return promises;
  }, []);
  return Promise.all(allPhotosOfAllArticles)
    .then(photos => flatten(photos))
    .then(photos => photoRepository.createPhotos(photos));
}

function getPhotosOfArticle({ dropboxId }) {
  return DropboxClient.getArticlePhotosPaths(dropboxId)
    .then(paths => filterOnlyGalleryPhotos(paths))
    .then(paths => createPhotoOfArticle(paths, dropboxId));
}

function filterOnlyGalleryPhotos(paths) {
  const photosPaths = paths.filter((path) => {
    const extension = path.split('.').pop();
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png';
  });
  return photosPaths.filter((path) => {
    const shortName = path.split('/').pop().substring(0, 3).toLowerCase();
    return shortName !== 'img';
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

function _insertArticlesContentsInDatabase({ addedArticles }) {
  const allChaptersToSave = addedArticles.reduce((promises, article) => {
    const chaptersToSave = _updateTitleAndExtractChaptersFromArticleContent(article);
    promises.push(chaptersToSave);
    return promises;
  }, []);
  return Promise.all(allChaptersToSave)
    .then(allChapters => flatten(allChapters))
    .then(chapters => chapterRepository.createArticleChapters(chapters));
}

function _updateTitleAndExtractChaptersFromArticleContent(article) {
  const dropboxId = article.dropboxId;
  return Promise.all([
    DropboxClient.getFrTextFileStream(dropboxId),
    DropboxClient.getEnTextFileStream(dropboxId),
  ])
    .then(files => Promise.all([
      FileReader.read(files[0]),
      FileReader.read(files[1]),
    ]))
    .then(articleContents => _serializeArticleContents(articleContents, dropboxId))
    .then(articleInfos => _updateArticleTitles(articleInfos, dropboxId))
    .then(articleInfos => _shareChapterImages(articleInfos, dropboxId))
    .then(articleInfos => articleInfos.chapters);
}

function _updateArticleTitles(articleInfos, dropboxId) {
  const { frTitle, enTitle } = articleInfos;
  articleRepository.update({ frTitle, enTitle }, dropboxId);
  return articleInfos;
}

function _serializeArticleContents(rawArticles, dropboxId) {
  const cuttedArticles = rawArticles.map(rawArticle => rawArticle
    .split('*')
    .map(row => row.trim()));

  const chapters = _generateChapters(cuttedArticles, dropboxId);

  return {
    frTitle: cuttedArticles[0][0],
    enTitle: cuttedArticles[1][0],
    chapters,
  };
}

function _generateChapters(cuttedArticles, dropboxId) {
  const frenchArticle = cuttedArticles[0];
  const englishArticle = cuttedArticles[1];
  const chapters = [];
  for (let i = 1; i < frenchArticle.length / 3; i += 1) {
    const imgLink = `img${i}.jpg`;
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

function _shareChapterImages(articleInfos, dropboxId) {
  const chaptersWithSharableLink = articleInfos.chapters.reduce((promises, chapter) => {
    const promise = _shareChapterImage(chapter.imgLink, dropboxId);
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

function _shareChapterImage(imgLink, dropboxId) {
  return DropboxClient.createSharedLink(`/${dropboxId}/${imgLink}`)
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
