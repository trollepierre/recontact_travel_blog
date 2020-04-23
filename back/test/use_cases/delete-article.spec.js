import { expect, sinon } from '../test-helper'
import DeleteArticle from '../../src/use_cases/delete-article'
import ArticleRepository from '../../src/domain/repositories/article-repository'

describe('Unit | DeleteArticle | deleteArticle', () => {
  beforeEach(() => {
    sinon.stub(ArticleRepository, 'deleteByDropboxId').resolves({})
  })

  afterEach(() => {
    ArticleRepository.deleteByDropboxId.restore()
  })

  it('should call ArticleRepository to deleteByDropboxId and return empty', () => {
    // when
    const promise = DeleteArticle.deleteArticle()

    // then
    expect(ArticleRepository.deleteByDropboxId).to.have.been.calledWith()
    return promise.then(returnedArticles => {
      expect(returnedArticles).to.deep.equal({})
    })
  })
})

