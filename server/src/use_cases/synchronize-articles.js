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

function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
  const result = report; // todo : remove one var here
  if (result.hasChanges) {
    return _updateArticleInDatabase(result)
      .then(() => _updateChaptersInDatabase(result))
      .then(() => Promise.resolve(result));
  }
  return Promise.resolve(result);
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

function _updateArticleInDatabase(report) {
  const { addedArticles } = report;
  return _shareImagesZeros(addedArticles) // todo prepare une validation d'image si manquante
    .then(articles => articleRepository.create(articles));
}

function _updateChaptersInDatabase({ addedArticles }) {
  const allChaptersToSave = addedArticles.reduce((promises, article) => {
    const chaptersOfThisArticleToSave = _getCompleteChaptersToShare(article);
    promises.push(chaptersOfThisArticleToSave);
    return promises;
  }, []);
  return Promise.all(allChaptersToSave)
    .then(allChapters => flatten(allChapters))
    .then(chapters => chapterRepository.createArticleChapters(chapters)); // todo : delete former rows of this article
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

function _getCompleteChaptersToShare(article) {
  const articleId = article.dropboxId;
  return DropboxClient.getTextFileStream(articleId) // todo understand why some articles (like 57) cannot be found by Dropbox
    .then(FileReader.read)
    .then(chaptersContent => _serializeChapters(chaptersContent))
    .then(chapters => _shareChapterImages(chapters, articleId))
    .then(chapters => chapters.chapters.map(chapter => Object.assign(chapter, { dropboxId: article.dropboxId }))); // todo : add to former method
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
  return DropboxClient.createSharedLink(article.imgPath)
    .then(imgLink => ({
      dropboxId: article.dropboxId,
      imgLink: _transformToDownloadableLink(imgLink),
    }));
}

function _serializeChapters(rawArticle) {
  const cuttedArticle = rawArticle
    .split('*')
    .map(row => row.trim());

  const chapters = _generateChapters(cuttedArticle);

  return {
    title: cuttedArticle[0],
    chapters,
  };
}

function _generateChapters(cuttedArticle) {
  const chapters = [];
  for (let i = 1; i < cuttedArticle.length / 3; i += 1) {
    const imgLink = `img${i}.jpg`;
    const title = cuttedArticle[(3 * i) - 2];
    const subtitle = cuttedArticle[(3 * i) - 1];
    chapters[i - 1] = {
      title: [title, subtitle].join(' ').trim(),
      imgLink,
      // TODO : add Paragraph from data in db -  text: this._addParagraphs(cuttedArticle[3 * i]),
      text: cuttedArticle[3 * i],
    };
  }
  return chapters;
}

function _shareChapterImages(chapters, idArticle) {
  const chaptersWithSharableLink = chapters.chapters.reduce((promises, chapter) => {
    const promise = _shareChapterImage(chapter.imgLink, idArticle);
    promises.push(promise);
    return promises;
  }, []);
  return Promise.all(chaptersWithSharableLink)
    .then((imgLinks) => {
      const newChapters = chapters;
      for (let i = 0; i < imgLinks.length; i += 1) {
        newChapters.chapters[i].imgLink = imgLinks[i];
      }
      return newChapters;
    });
}

function _shareChapterImage(imgLink, articleId) {
  return DropboxClient.createSharedLink(`/${articleId}/${imgLink}`)
    .then(_transformToDownloadableLink);
}

function _transformToDownloadableLink(response) {
  if (isEmpty(response)) {
    return '';
  }
  return response.url.replace(/.$/, '1');
}

module.exports = {
  synchronizeArticles,
};
