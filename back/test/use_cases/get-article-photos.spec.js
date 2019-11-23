import { expect, sinon } from '../test-helper'
import GetArticlePhotos from '../../src/use_cases/get-article-photos'
import PhotoRepository from '../../src/domain/repositories/photo-repository'
import photo from '../fixtures/photo'

describe('Unit | GetArticlePhotos | getArticlePhotos', () => {
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
    GetArticlePhotos.getArticlePhotos(dropboxId)

    // then
    expect(PhotoRepository.getPhotosOfArticle).to.have.been.calledWith(dropboxId)
  })

  it('should return photos', () => {
    // when
    const promise = GetArticlePhotos.getArticlePhotos(dropboxId)

    // then
    return promise.then(returnedPhotos => {
      expect(returnedPhotos).to.deep.equal(photos)
    })
  })
})

