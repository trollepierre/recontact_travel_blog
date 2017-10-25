const articleRepository = require('../domain/repositories/article-repository');

// TODO what if database is not synchronized?
function getAllArticles() {
  return articleRepository.getAll();
}

module.exports = {
  getAllArticles,
};
