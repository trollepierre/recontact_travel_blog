import photoRepository from '../domain/repositories/photo-repository'

function getArticlePhotos(dropboxId) {
  return photoRepository.getPhotosOfArticle(dropboxId)
}

export default {
  getArticlePhotos,
}
