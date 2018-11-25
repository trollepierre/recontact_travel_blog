import photoRepository from '../domain/repositories/photo-repository'

function getAllPhotos(dropboxId) {
  return photoRepository.getPhotosOfArticle(dropboxId)
}

export {
  getAllPhotos,
}
