import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import UpdateArticle from '../../../src/use_cases/update-article'

describe('Integration | Routes | admin route', () => {
  describe('/admin/articles/:id', () => {
    beforeEach(() => {
      sinon.stub(UpdateArticle, 'sync').resolves()
    })

    afterEach(() => {
      UpdateArticle.sync.restore()
    })

    it('should call delete article and send 204', (done) => {
      // Given
      const stringIdArticle = '59'

      // When
      request(app)
        .patch(`/api/admin/articles/${stringIdArticle}`)
        .end((err, response) => {
          // Then
          expect(UpdateArticle.sync).to.have.been.calledWith(stringIdArticle)
          expect(response.status).to.deep.equal(204)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })
})
