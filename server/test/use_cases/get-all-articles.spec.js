import { expect, sinon } from '../test-helper'
import GetAllArticles from '../../src/use_cases/get-all-articles'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import articles from '../fixtures/articlesWithSharedLink'

describe('Unit | GetAllArticles | getAllArticles', () => {
  beforeEach(() => {
    sinon.stub(ArticleRepository, 'getAll').resolves(articles())
  })

  afterEach(() => {
    ArticleRepository.getAll.restore()
  })

  it('should call ArticleRepository to getAll articles to return', () => {
    // when
    const promise = GetAllArticles.getAllArticles()

    // then
    expect(ArticleRepository.getAll).to.have.been.calledWith()
    return promise.then(returnedArticles => {
      expect(returnedArticles).to.deep.equal(articles())
    })
  })
})

