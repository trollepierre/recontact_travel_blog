import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import GetArticlesError from '../../../src/use_cases/get-articles-error'
import { dummyArticleMeta } from '../../dummies/dummyArticle'

describe('Integration | Routes | articles-error route', () => {
  const articlesError = [dummyArticleMeta()]
  beforeEach(() => {
    sinon.stub(GetArticlesError, 'getAll').resolves(articlesError)
  })

  afterEach(() => {
    GetArticlesError.getAll.restore()
  })

  it('should be 200 with /articles-error and handle query params', done => {
    request(app)
      .get('/api/articles-error?photos=off')
      .end((err, response) => {
        expect(GetArticlesError.getAll).to.have.been.calledWith({ photos: 'off' })
        expect(response.body).to.deep.equal(articlesError)
        expect(response.status).to.equal(200)
        if (err) {
          done(err)
        }
        done()
      })
  })
})
