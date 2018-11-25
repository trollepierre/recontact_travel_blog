const { expect, sinon } = require('../test-helper')
const GetPhotosOfArticle = require('../../src/use_cases/get-photos-of-article')
const PhotoRepository = require('../../src/domain/repositories/photo-repository')
const photo = require('../fixtures/photo')

describe('Unit | GetPhotosOfArticle | getAllPhotos', () => {
  const dropboxId = 8
  const photos = [photo()]

  beforeEach(() => {
    sinon.stub(PhotoRepository, 'getPhotosOfArticle').resolves(photos)
  })

  afterEach(() => {
    PhotoRepository.getPhotosOfArticle.restore()
  })

  it('should call PhotoRepository to getPhotosOfArticle articles', () => {
    // when
    GetPhotosOfArticle.getAllPhotos(dropboxId)

    // then
    expect(PhotoRepository.getPhotosOfArticle).to.have.been.calledWith(dropboxId)
  })

  it('should return photos', () => {
    // when
    const promise = GetPhotosOfArticle.getAllPhotos(dropboxId)

    // then
    return promise.then((returnedPhotos) => {
      expect(returnedPhotos).to.deep.equal(photos)
    })
  })
})

