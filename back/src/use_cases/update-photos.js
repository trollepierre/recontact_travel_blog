import photoRepository from '../domain/repositories/photo-repository'
import DropboxClient from '../infrastructure/external_services/dropbox-client'
import CreateArticleGallery from './services/create-article-gallery'

async function sync(dropboxId) {
  photoRepository.deletePhotosOfArticle(dropboxId)
  const dropboxFilesPath = await DropboxClient.getFilesFolderPaths(dropboxId)
  return CreateArticleGallery.createArticleGallery(dropboxFilesPath, dropboxId)
}

export default {
  sync,
}
