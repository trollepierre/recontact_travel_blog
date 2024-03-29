import { expect, sinon } from '../../test-helper'
import articleRepository from '../../../src/domain/repositories/article-repository'
import { Article } from '../../../src/domain/models/index'
import { dummyArticleFromDb, dummySimpleArticle } from '../../dummies/dummyArticle'

describe('Unit | Repository | article-repository', () => {
  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Article, 'bulkCreate')
    })

    afterEach(() => {
      Article.bulkCreate.restore()
    })

    it('should call Sequelize Model#bulkCreate', () => {
      // given
      const articlesToSave = [dummySimpleArticle(), dummySimpleArticle()]
      const savedArticles = [dummyArticleFromDb(), dummyArticleFromDb()]
      Article.bulkCreate.resolves(savedArticles)

      // when
      const promise = articleRepository.create(articlesToSave)

      // then
      return promise.then(res => {
        expect(Article.bulkCreate).to.have.been.called
        expect(res).to.deep.equal(savedArticles)
      })
    })
  })

  describe('#getAll', () => {
    beforeEach(() => {
      sinon.stub(Article, 'findAll').resolves()
    })

    afterEach(() => {
      Article.findAll.restore()
    })

    it('should call Sequelize Model#findAll', () => {
      // when
      const promise = articleRepository.getAll()

      // then
      return promise.then(() => {
        expect(Article.findAll).to.have.been.called
      })
    })
  })

  describe('#get', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Article, 'findOne').resolves(dummyArticleFromDb())
    })

    afterEach(() => {
      Article.findOne.restore()
    })

    it('should call Sequelize Model#findOne', () => {
      // when
      const promise = articleRepository.get(dropboxId)

      // then
      return promise.then(res => {
        expect(Article.findOne).to.have.been.calledWith({ where: { dropboxId } })
        expect(res).to.deep.equal(dummyArticleFromDb())
      })
    })
  })

  describe('#update', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Article, 'update').resolves()
    })

    afterEach(() => {
      Article.update.restore()
    })

    it('should call Sequelize Model#update', () => {
      // when
      const promise = articleRepository.update({ title: 'title' }, dropboxId)

      // then
      return promise.then(() => {
        expect(Article.update).to.have.been.calledWith({ title: 'title' }, { where: { dropboxId } })
      })
    })
  })

  describe('#deleteByDropboxId', () => {
    const dropboxId = 47

    beforeEach(() => {
      sinon.stub(Article, 'destroy').resolves()
    })

    afterEach(() => {
      Article.destroy.restore()
    })

    it('should call Sequelize Model#destroy', () => {
      // when
      const promise = articleRepository.deleteByDropboxId(dropboxId)

      // then
      return promise.then(() => {
        expect(Article.destroy).to.have.been.calledWith({ where: { dropboxId } })
      })
    })
  })
})
