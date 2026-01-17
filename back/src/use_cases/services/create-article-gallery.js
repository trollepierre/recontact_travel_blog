import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import photoRepository from '../../domain/repositories/photo-repository'
import DropboxClient from '../../infrastructure/external_services/dropbox-client'

const createArticleGallery = (dropboxFilesPath, dropboxId) => getPhotosOfArticle(dropboxFilesPath, dropboxId)
  .then(photos => flatten(photos))
  .then(photos => photoRepository.createPhotos(photos))

function getPhotosOfArticle(dropboxFilesPath, dropboxId) {
  const paths = filterOnlyGalleryPhotos(dropboxFilesPath)
  return createPhotoOfArticle(paths, dropboxId)
}

function filterOnlyGalleryPhotos(paths) {
  const photosPaths = paths.filter(path => {
    const extension = path.split('.').pop()
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png'
  })
  return photosPaths.filter(path => {
    const shortName = path.split('/').pop().substring(0, 3)
    return !shortName.match('[iI]mg')
  })
}

function createPhotoOfArticle(paths, dropboxId) {
  const allImgLinks = paths.reduce((promises, path) => {
    const imgLink = serializePhoto(path, dropboxId)
    promises.push(imgLink)
    return promises
  }, [])
  return Promise.all(allImgLinks)
}

function serializePhoto(path, dropboxId) {
  return DropboxClient.createSharedLink(path)
    .then(response => ({
      imgLink: _transformToImgLink(response),
      dropboxId,
    }))
}

function _transformToImgLink(response) {
  if (isEmpty(response)) {
    console.error('is empty imgLink')
    return ''
  }
  const split = response.url.replace(/....$/, '').split('/s/')
  return `${split[0]}/s/raw/${split[1].split('?')[0]}`
}

export default {
  createArticleGallery,
}
