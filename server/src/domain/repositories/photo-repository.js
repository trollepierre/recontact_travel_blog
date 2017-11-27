const { Photo } = require('../models/index');

function createPhotos(photos) {
  return Photo
    .bulkCreate(photos);
}

function getPhotosOfArticle(dropboxId) {
  return Photo.findAll({
    where: { dropboxId },
  });
}

function deletePhotosOfArticle(dropboxId) {
  return Photo.destroy({
    where: { dropboxId },
  });
}

function deleteAll() {
  return Photo.destroy({ where: {} });
}

module.exports = {
  createPhotos,
  getPhotosOfArticle,
  deletePhotosOfArticle,
  deleteAll,
};
