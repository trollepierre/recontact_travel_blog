const { Article } = require('../../infrastructure/db/index');

function create(articles) {
  return Article
    .bulkCreate(articles);
}

function getAll() {
  return Article
    .all();
}

module.exports = {
  create,
  getAll,
};
