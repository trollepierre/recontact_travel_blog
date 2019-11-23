import { expect, sinon } from '../test-helper'
import UpdateArticles from '../../src/use_cases/update-articles'
import UpdateArticle from '../../src/use_cases/update-article'

describe('Unit | UpdateArticles | sync', () => {
  beforeEach(() => {
    sinon.stub(UpdateArticle, 'sync').resolves()
  })

  afterEach(() => {
    UpdateArticle.sync.restore()
  })

  it('should call update article with 1', () => {
    // When
    const promise = UpdateArticles.sync({ min: 1, max: 1 })

    // Then
    promise.then(() => {
      expect(UpdateArticle.sync).to.have.been.calledWith('1')
    })
  })

  it('should call update article with 1 as min when 0 setted', () => {
    // When
    const promise = UpdateArticles.sync({ min: 0, max: 2 })

    // Then
    promise.then(() => {
      expect(UpdateArticle.sync).to.have.been.callCount(2)
      expect(UpdateArticle.sync).to.have.been.calledWith('1')
      expect(UpdateArticle.sync).to.have.been.calledWith('2')
    })
  })

  it('should call update article with 87 as min when min > max setted', () => {
    // When
    const promise = UpdateArticles.sync({ min: 85, max: 3 })

    // Then
    promise.then(() => {
      expect(UpdateArticle.sync).to.have.been.callCount(3)
      expect(UpdateArticle.sync).to.have.been.calledWith('87')
      expect(UpdateArticle.sync).to.have.been.calledWith('86')
      expect(UpdateArticle.sync).to.have.been.calledWith('85')
    })
  })
})
