const { expect, sinon } = require('../test-helper')
const GetAllArticles = require('../../src/use_cases/get-all-articles')
const ArticleRepository = require('../../src/domain/repositories/article-repository')
const articles = require('../fixtures/articlesWithSharedLink')

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
    return promise.then((returnedArticles) => {
      expect(returnedArticles).to.deep.equal(articles())
    })
  })
})

