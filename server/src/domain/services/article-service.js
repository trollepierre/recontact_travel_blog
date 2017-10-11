const { Article } = require('../models');

function createArticles(articles) {
  return Article
    .bulkCreate(articles);
}

module.exports = {
  createArticles,
};
