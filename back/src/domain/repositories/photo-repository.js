import { Photo } from '../models/index'

function createPhotos(photos) {
  return Photo
    .bulkCreate(photos)
}

function getPhotosOfArticle(dropboxId) {
  return Photo.findAll({
    where: { dropboxId },
  })
}

function deletePhotosOfArticle(dropboxId) {
  return Photo.destroy({
    where: { dropboxId },
  })
}

function deleteAll() {
  return Photo.destroy({ where: {} })
}

export default {
  createPhotos,
  getPhotosOfArticle,
  deletePhotosOfArticle,
  deleteAll,
}
