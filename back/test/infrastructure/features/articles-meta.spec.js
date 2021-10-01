import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import GetArticlesMeta from '../../../src/use_cases/get-articles-meta'
import { dummyArticleMeta } from '../../dummies/dummyArticle'

describe('Integration | Routes | articles-meta route', () => {
  const articlesMeta = [dummyArticleMeta()]
  beforeEach(() => {
    sinon.stub(GetArticlesMeta, 'getAll').resolves(articlesMeta)
  })

  afterEach(() => {
    GetArticlesMeta.getAll.restore()
  })

  it('should be 200 with /articles-meta and handle query params', done => {
    request(app)
      .get('/api/articles-meta')
      .end((err, response) => {
        expect(GetArticlesMeta.getAll).to.have.been.calledWith()
        expect(response.body).to.deep.equal(articlesMeta)
        expect(response.status).to.equal(200)
        if (err) {
          done(err)
        }
        done()
      })
  })
})
