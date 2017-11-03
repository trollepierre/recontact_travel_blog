const chapterRepository = require('../domain/repositories/chapter-repository');
const articleRepository = require('../domain/repositories/article-repository');

function deleteArticle(dropboxId) {
  return Promise.all([
    articleRepository.deleteArticle(dropboxId),
    chapterRepository.deleteChaptersOfArticle(dropboxId),
  ]);
}

module.exports = {
  deleteArticle,
};
