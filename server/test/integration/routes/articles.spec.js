const { request, expect } = require('../../test-helper');
const app = require('../../../app');

describe('Integration | Routes | index route', () => {
  it('should have api informations on root', (done) => {
    // Given
    const article = {
      imgLink: 'https://www.dropbox.com/s/fghmcj18maztdgv/img0.jpg?dl=1',
    };

    // When
    request(app)
      .get('/articles')
      .expect('Content-Type', /json/)
      .end((err, response) => {
        // Then
        expect(response.body).to.deep.equal([article]);
        if (err) {
          done(err);
        }
        done();
      });
  });
});
