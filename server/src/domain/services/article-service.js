const { Article } = require('../models');

function addArticle(name, imgLink) {
  return Article
    .findOrCreate({ where: { name, imgLink } })
    .spread((article, created) => ({ article, created }));
}

function removeArticle(articleId) {
  return Article.destroy({ where: { id: articleId } });
}

module.exports = {
  addArticle,
  removeArticle,
};
