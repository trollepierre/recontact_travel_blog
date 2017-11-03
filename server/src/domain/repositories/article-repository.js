const { Article } = require('../models/index');

function create(articles) {
  return Article
    .bulkCreate(articles);
}

function getAll() {
  return Article
    .all();
}

function deleteArticle(dropboxId) {
  return Article.destroy({
    where: { dropboxId },
  });
}

module.exports = {
  create,
  getAll,
  deleteArticle,
};
