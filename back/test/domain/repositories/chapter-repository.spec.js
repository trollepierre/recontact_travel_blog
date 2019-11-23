import { expect, sinon } from '../../test-helper'
import chapterRepository from '../../../src/domain/repositories/chapter-repository'
import { Newchapter } from '../../../src/domain/models/index'
import chapterOfArticleSaved from '../../fixtures/chapterOfArticleSaved'
import chapterOfArticleToSave from '../../fixtures/chapterOfArticleToSave'

describe('Unit | Repository | chapter-repository', () => {
  let chaptersOfArticleToSave
  let savedChaptersOfArticle
  let sortedChaptersOfArticle

  beforeEach(() => {
    chaptersOfArticleToSave = [chapterOfArticleToSave(), chapterOfArticleToSave()]
    savedChaptersOfArticle = [chapterOfArticleSaved(99), chapterOfArticleSaved(1)]
    sortedChaptersOfArticle = [chapterOfArticleSaved(1), chapterOfArticleSaved(99)]
  })

  describe('#createArticleChapters', () => {
    beforeEach(() => {
      sinon.stub(Newchapter, 'bulkCreate')
    })

    afterEach(() => {
      Newchapter.bulkCreate.restore()
    })

    it('should call Sequelize Model#bulkCreate', () => {
      // given
      Newchapter.bulkCreate.resolves(savedChaptersOfArticle)

      // when
      const promise = chapterRepository.createArticleChapters(chaptersOfArticleToSave)

      // then
      return promise.then(res => {
        expect(Newchapter.bulkCreate).to.have.been.called
        expect(res).to.deep.equal(savedChaptersOfArticle)
      })
    })
  })

  describe('#getChaptersOfArticle', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Newchapter, 'findAll').resolves(savedChaptersOfArticle)
    })

    afterEach(() => {
      Newchapter.findAll.restore()
    })

    it('should call Sequelize Model#findAll', () => {
      // when
      const promise = chapterRepository.getChaptersOfArticle(dropboxId)

      // then
      return promise.then(res => {
        expect(Newchapter.findAll).to.have.been.calledWith({ where: { dropboxId } })
        expect(res).to.deep.equal(sortedChaptersOfArticle)
      })
    })
  })

  describe('#deleteChaptersOfArticle', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Newchapter, 'destroy').resolves()
    })

    afterEach(() => {
      Newchapter.destroy.restore()
    })

    it('should call Sequelize Model#destroy', () => {
      // when
      const promise = chapterRepository.deleteChaptersOfArticle(dropboxId)

      // then
      return promise.then(() => {
        expect(Newchapter.destroy).to.have.been.calledWith({ where: { dropboxId } })
      })
    })
  })
})

