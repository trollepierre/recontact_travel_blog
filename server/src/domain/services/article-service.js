const { Article } = require('../models');

function createArticles(articles) {
  return Article
    .bulkCreate(articles);
}

function getAll() {
  return Article
    .all();
}

module.exports = {
  createArticles,
  getAll,
};
