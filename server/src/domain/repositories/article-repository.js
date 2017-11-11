const { Article } = require('../models/index');

function create(articles) {
  return Article.bulkCreate(articles);
}

function getAll() {
  return Article.all();
}

function get(dropboxId) {
  return Article.findOne({ where: { dropboxId } });
}

function updateTitle(title, dropboxId) {
  return Article.update({ title }, { where: { dropboxId } });
}

function deleteArticle(dropboxId) {
  return Article.destroy({ where: { dropboxId } });
}

module.exports = {
  create,
  getAll,
  get,
  deleteArticle,
  updateTitle,
};
