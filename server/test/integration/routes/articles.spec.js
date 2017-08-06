const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const DropboxClient = require('../../../src/infrastructure/dropbox');

describe('Integration | Routes | articles route', () => {
  afterEach(() => {
    DropboxClient.getFile.restore();
  });

  it('should have api informations on root', (done) => {
    // Given
    const article = {
      imgLink: 'https://www.dropbox.com/s/fghmcj18maztdgv/img0.jpg?dl=1',
    };
    sinon.stub(DropboxClient, 'getFile').resolves();

    // When
    request(app)
      .get('/articles')
      .expect('Content-Type', /json/)
      .end((err, response) => {
        // Then
        expect(response.body).to.deep.equal([article, {}]);
        if (err) {
          done(err);
        }
        done();
      });
  });
});
