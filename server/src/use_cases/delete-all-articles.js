const articleRepository = require('../domain/repositories/article-repository');

function deleteAllArticles() {
  return articleRepository.deleteAll();
}

module.exports = {
  deleteAllArticles,
};
