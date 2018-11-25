const photoRepository = require('../domain/repositories/photo-repository')

function getAllPhotos(dropboxId) {
  return photoRepository.getPhotosOfArticle(dropboxId)
}

module.exports = {
  getAllPhotos,
}
