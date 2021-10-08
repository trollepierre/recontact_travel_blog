import { expect, sinon } from '../test-helper'
import GetAllArticles from '../../src/use_cases/get-all-articles'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import { dummySimpleArticle } from '../dummies/dummyArticle'

describe('Unit | GetAllArticles | getAllArticles', () => {
  let articles

  beforeEach(() => {
    articles = [
      dummySimpleArticle({ dropboxId: '1' }),
      dummySimpleArticle({ dropboxId: '2' }),
      dummySimpleArticle({ dropboxId: '5' }),
      dummySimpleArticle({ dropboxId: '4' }),
      dummySimpleArticle({ dropboxId: '3' }),
    ]
    sinon.stub(ArticleRepository, 'getAll').resolves(articles)
  })

  afterEach(() => {
    ArticleRepository.getAll.restore()
  })

  it('should call ArticleRepository to getAll articles to return following limit', () => {
    // when
    const promise = GetAllArticles.getAllArticles('4')

    // then
    expect(ArticleRepository.getAll).to.have.been.calledWith()
    return promise.then(returnedArticles => {
      expect(returnedArticles).to.deep.equal([
        dummySimpleArticle({ dropboxId: '5' }),
        dummySimpleArticle({ dropboxId: '4' }),
        dummySimpleArticle({ dropboxId: '3' }),
        dummySimpleArticle({ dropboxId: '2' }),
      ])
    })
  })

  it('should call ArticleRepository to getAll articles to return when limit is 0', () => {
    // when
    const promise = GetAllArticles.getAllArticles('0')

    // then
    expect(ArticleRepository.getAll).to.have.been.calledWith()
    return promise.then(returnedArticles => {
      expect(returnedArticles).to.deep.equal(articles)
    })
  })
})

