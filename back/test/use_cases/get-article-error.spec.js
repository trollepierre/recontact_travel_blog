import { expect, sinon } from '../test-helper'
import GetArticlesError from '../../src/use_cases/get-articles-error'
import GetArticlesMeta from '../../src/use_cases/get-articles-meta'
import articles from '../fixtures/articlesWithSharedLink'

describe('Unit | GetArticle | getArticle()', () => {
  beforeEach(() => {
    sinon.stub(GetArticlesMeta, 'getAll').returns(articles())
  })

  afterEach(() => {
    GetArticlesMeta.getAll.restore()
  })

  it('should call GetArticlesMeta to getAll articles', async () => {
    // when
    await GetArticlesError.getAll()

    // then
    expect(GetArticlesMeta.getAll).to.have.been.calledWith()
  })
})

