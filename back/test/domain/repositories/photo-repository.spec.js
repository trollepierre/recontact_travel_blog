import { expect, sinon } from '../../test-helper'
import photoRepository from '../../../src/domain/repositories/photo-repository'
import { Photo } from '../../../src/domain/models/index'
import photoOfArticleSaved from '../../fixtures/photoOfArticleSaved'
import photoOfArticleToSave from '../../fixtures/photo'

describe('Unit | Repository | photo-repository', () => {
  let photosOfArticleToSave
  let savedPhotosOfArticle = [photoOfArticleToSave()]

  beforeEach(() => {
    photosOfArticleToSave = [photoOfArticleToSave(), photoOfArticleToSave()]
    savedPhotosOfArticle = [photoOfArticleSaved(), photoOfArticleSaved()]
  })

  describe('#createPhotos()', () => {
    beforeEach(() => {
      sinon.stub(Photo, 'bulkCreate')
    })

    afterEach(() => {
      Photo.bulkCreate.restore()
    })

    it('should call Sequelize Model#bulkCreate', () => {
      // given
      Photo.bulkCreate.resolves(savedPhotosOfArticle)

      // when
      const promise = photoRepository.createPhotos(photosOfArticleToSave)

      // then
      return promise.then(res => {
        expect(Photo.bulkCreate).to.have.been.called
        expect(res).to.deep.equal(savedPhotosOfArticle)
      })
    })
  })

  describe('#getPhotosOfArticle', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Photo, 'findAll').resolves(savedPhotosOfArticle)
    })

    afterEach(() => {
      Photo.findAll.restore()
    })

    it('should call Sequelize Model#all', () => {
      // when
      const promise = photoRepository.getPhotosOfArticle(dropboxId)

      // then
      return promise.then(res => {
        expect(Photo.findAll).to.have.been.calledWith({ where: { dropboxId } })
        expect(res).to.deep.equal(savedPhotosOfArticle)
      })
    })
  })

  describe('#deletePhotosOfArticle', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Photo, 'destroy').resolves()
    })

    afterEach(() => {
      Photo.destroy.restore()
    })

    it('should call Sequelize Model#destroy', () => {
      // when
      const promise = photoRepository.deletePhotosOfArticle(dropboxId)

      // then
      return promise.then(() => {
        expect(Photo.destroy).to.have.been.calledWith({ where: { dropboxId } })
      })
    })
  })
})

