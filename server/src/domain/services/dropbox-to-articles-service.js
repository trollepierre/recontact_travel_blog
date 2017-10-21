const File = require('../../infrastructure/file');
const DropboxClient = require('../../infrastructure/dropbox');
const ArticlesSerializer = require('../../serializers/articles');
const ChaptersSerializer = require('../../serializers/chapters');
const { isEmpty } = require('lodash');
// const mailService = require('./mail-service');
const articleService = require('./article-service');
const chapterService = require('./chapter-service');


function _compareDropboxAndDatabaseArticles(freshArticles) {
  return articleService.getAll()
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

function _updateArticleInDatabase(report) {
  const { addedArticles } = report;
  return DropboxClient.shareImages(addedArticles)
    .then(articles => articleService.createArticles(articles))
    .then(() => Promise.resolve(report));
}

function _getCompleteChaptersToShare(article) {
  const articleId = article.dropboxId;
  return DropboxClient.getFileContentStream(articleId) // todo understand why some articles (like 57) cannot be found by Dropbox
    .then(File.read)
    .then(chaptersContent => ChaptersSerializer.serialize(chaptersContent))
    .then(chapters => DropboxClient.shareChapterImages(chapters, articleId))
    .then(chapters => chapters.chapters.map(chapter => Object.assign(chapter, { dropboxId: article.dropboxId }))); // todo : add to former method
}

function _updateChapterInDatabase({ addedArticles }) {
  const allChaptersToSave = addedArticles.reduce((promises, article) => {
    const chaptersOfThisArticleToSave = _getCompleteChaptersToShare(article);
    promises.push(chaptersOfThisArticleToSave);
    return promises;
  }, []);
  return Promise.all(allChaptersToSave)
    .then(chapters => chapterService.createArticleChapters(chapters)); // todo : delete former rows of this article
}

function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
  const result = report; // todo : remove one var here
  if (result.hasChanges) {
    return _updateArticleInDatabase(report);
  }
  return Promise.resolve(result);
}

function _ifArticlesChangesThenUpdateChaptersInDatabase(report) {
  const result = report;
  if (result.hasChanges) {
    return _updateChapterInDatabase(report);
  }
  return Promise.resolve(result);
}

// function _ifArticlesChangedThenSendEmailToRecipients(report) {
//   const result = report;
//   if (result.hasChanges) {
//     return mailService.sendJobsChangedEmail(result);
//   }
//   return Promise.resolve(result);
// }

function synchronizeArticles() {
  return DropboxClient.getAllFileMetaDataInDropbox()
    .then(ArticlesSerializer.serialize)
    .then(fetchedArticles => _compareDropboxAndDatabaseArticles(fetchedArticles))
    .then(_ifArticlesChangesThenUpdateArticlesInDatabase)
    .then(_ifArticlesChangesThenUpdateChaptersInDatabase);
  // 2.B.4 j'envoie un mail aux abonnés
  // .then(_ifArticlesChangedThenSendEmailToRecipients);
}

// todo test all and extract methods

module.exports = {
  synchronizeArticles,
};
