const articleService = require('../domain/database_services/article-service');

// TODO what if database is not synchronized?
function getAllArticles() {
  return articleService.getAll();
}

module.exports = {
  getAllArticles,
};
