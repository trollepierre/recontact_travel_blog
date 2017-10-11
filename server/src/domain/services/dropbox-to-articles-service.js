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


function _updateChapterInDatabase({ addedArticles }) {
  return addedArticles.map((article) => {
    const articleId = article.dropboxId;
    return DropboxClient.getFileContentStream(articleId)
      .then(File.read)
      .then(chaptersContent => ChaptersSerializer.serialize(chaptersContent))
      .then(chapters => DropboxClient.shareChapterImages(chapters, articleId))
      .then(chapters => chapterService.createChaptersAffectedToArticle(chapters, article));
  });
}

function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
  const result = report;
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

module.exports = {
  synchronizeArticles,
};
