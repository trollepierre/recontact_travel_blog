import { expect, sinon } from '../test-helper'
import UpdatePhotos from '../../src/use_cases/update-photos'
import photoRepository from '../../src/domain/repositories/photo-repository'
import DropboxClient from '../../src/infrastructure/external_services/dropbox-client'
import CreateArticleGallery from '../../src/use_cases/services/create-article-gallery'
import dropboxPhotosPaths from '../fixtures/filteredDropboxPathsOfArticle'
import PhotoRepository from '../../src/domain/repositories/photo-repository'

describe.skip('Unit | UpdatePhotos | sync', () => {
  const dropboxId = '43'

  beforeEach(() => {
    sinon.stub(DropboxClient, 'getFilesFolderPaths').resolves(dropboxPhotosPaths)
    sinon.stub(PhotoRepository, 'deletePhotosOfArticle').resolves()
    sinon.stub(CreateArticleGallery, 'createArticleGallery').resolves()
  })

  afterEach(() => {
    PhotoRepository.createPhotos.restore()
    DropboxClient.getFilesFolderPaths.restore()
    CreateArticleGallery.createArticleGallery.restore()
  })

  it('should delete all the photos of article', () => {
    // Given
    // When
    UpdatePhotos.sync(dropboxId)

    // Then
    expect(photoRepository.deletePhotosOfArticle).to.have.been.calledWith(dropboxId)
  })

  it('should get dropbox files folder path', () => {
    // Given
    // When
    UpdatePhotos.sync(dropboxId)

    // Then
    expect(DropboxClient.getFilesFolderPaths).to.have.been.calledWith(dropboxId)
  })

  it('should get dropbox files folder path', () => {
    // Given
    // When
    UpdatePhotos.sync(dropboxId)

    // Then
    expect(CreateArticleGallery.createArticleGallery).to.have.been.calledWith(dropboxFilesPath, dropboxId)
  })
})
