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

function update(titleToUpdate, dropboxId) {
  return Article.update(titleToUpdate, { where: { dropboxId } });
}

function deleteArticle(dropboxId) {
  return Article.destroy({ where: { dropboxId } });
}

module.exports = {
  create,
  getAll,
  get,
  deleteArticle,
  update,
};
