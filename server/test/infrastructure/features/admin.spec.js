const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const DeleteArticle = require('../../../src/use_cases/delete-article');

describe('Integration | Routes | admin route', () => {
  describe('/admin/articles/:id', () => {
    beforeEach(() => {
      sinon.stub(DeleteArticle, 'deleteArticle').resolves();
    });

    afterEach(() => {
      DeleteArticle.deleteArticle.restore();
    });

    it('should call delete article and send 204', (done) => {
      // Given
      const stringIdArticle = '59';

      // When
      request(app)
        .get(`/api/admin/articles/${stringIdArticle}/delete`)
        .end((err, response) => {
          // Then
          expect(DeleteArticle.deleteArticle).to.have.been.calledWith(stringIdArticle);
          expect(response.status).to.deep.equal(204);
          if (err) {
            done(err);
          }
          done();
        });
    });
  });
});
