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

function getAll() {
  return Photo.findAll()
}

function add(position) {
  return Photo.create(position)
}

export default {
  createPhotos,
  add,
  getAll,
  getPhotosOfArticle,
  deletePhotosOfArticle,
  deleteAll,
}
