const FileReader = require('../infrastructure/external_services/file-reader');
const DropboxClient = require('../infrastructure/external_services/dropbox-client');
const mailJet = require('../infrastructure/mailing/mailjet');
const config = require('../infrastructure/config');
const { isEmpty, flatten } = require('lodash');
const articleRepository = require('../domain/repositories/article-repository');
const chapterRepository = require('../domain/repositories/chapter-repository');
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
      return Promise.resolve({ addedArticles, hasChanges });
    });
}

function _ifArticlesChangedThenSendEmailToRecipients(report) {
  const result = report;
  if (result.hasChanges) {
    return subscriptionRepository.getAll()
      .then((subscriptions) => {
        result.receivers = subscriptions.map(({ email }) => email);
        return result;
      })
      .then(form => _sendArticlesChangedEmail(form))
      .then(() => Promise.resolve(result));
  }
  return Promise.resolve(result);
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
  const result = report; // todo : remove one var here
  if (result.hasChanges) {
    return _createArticlesInDatabase(result)
      .then(() => _insertArticlesContentsInDatabase(result))
      .then(() => Promise.resolve(result));
  }
  return Promise.resolve(result);
}

function _createArticlesInDatabase(report) {
  const { addedArticles } = report;
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
    .then(chapters => chapterRepository.createArticleChapters(chapters)); // todo : delete former rows of this article
}

function _updateTitleAndExtractChaptersFromArticleContent(article) {
  const dropboxId = article.dropboxId;
  return DropboxClient.getTextFileStream(dropboxId)
    .then(FileReader.read)
    .then(articleContent => _serializeArticleContent(articleContent, dropboxId))
    .then(articleInfos => _updateArticleTitle(articleInfos, dropboxId))
    .then(articleInfos => _shareChapterImages(articleInfos, dropboxId))
    .then(articleInfos => articleInfos.chapters);
}

function _updateArticleTitle(articleInfos, dropboxId) {
  articleRepository.updateName(articleInfos.title, dropboxId);
  return articleInfos;
}

function _serializeArticleContent(rawArticle, dropboxId) {
  const cuttedArticle = rawArticle
    .split('*')
    .map(row => row.trim());

  const chapters = _generateChapters(cuttedArticle, dropboxId);

  return {
    title: cuttedArticle[0],
    chapters,
  };
}

function _generateChapters(cuttedArticle, dropboxId) {
  const chapters = [];
  for (let i = 1; i < cuttedArticle.length / 3; i += 1) {
    const imgLink = `img${i}.jpg`;
    const title = cuttedArticle[(3 * i) - 2];
    const subtitle = cuttedArticle[(3 * i) - 1];
    chapters[i - 1] = {
      dropboxId,
      title: [title, subtitle].join(' ').trim(),
      imgLink,
      // TODO : add Paragraph from data in db -  text: this._addParagraphs(cuttedArticle[3 * i]),
      text: cuttedArticle[3 * i],
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

// todo destructuring
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
