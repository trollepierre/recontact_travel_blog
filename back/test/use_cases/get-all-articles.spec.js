import { expect, sinon } from '../test-helper'
import GetAllArticles from '../../src/use_cases/get-all-articles'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import article from '../fixtures/articleToSave'

describe('Unit | GetAllArticles | getAllArticles', () => {
  let articles

  beforeEach(() => {
    articles = [
      article('1'),
      article('2'),
      article('5'),
      article('4'),
      article('3'),
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
        article('5'),
        article('4'),
        article('3'),
        article('2'),
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

