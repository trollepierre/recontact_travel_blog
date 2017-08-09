const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const DropboxClient = require('../../../src/infrastructure/dropbox');
const ArticlesSerializer = require('../../../src/serializers/articles');

describe('Integration | Routes | articles route', () => {
  const expectedArticles = [
    {
      name: '58',
      imgLink: '/58/img0.jpg',
    },
    {
      name: '59',
      imgLink: '/59/img0.jpg',
    },
  ];

  beforeEach(() => {
    sinon.stub(DropboxClient, 'getAllFileMetaDataInDropbox').resolves();
    sinon.stub(ArticlesSerializer, 'serialize').resolves(expectedArticles);
  });

  afterEach(() => {
    DropboxClient.getAllFileMetaDataInDropbox.restore();
    ArticlesSerializer.serialize.restore();
  });

  it('should have api informations on root', (done) => {
    // When
    request(app)
      .get('/articles')
      .expect('Content-Type', /json/)
      .end((err, response) => {
        // Then
        expect(response.body).to.deep.equal(expectedArticles);
        if (err) {
          done(err);
        }
        done();
      });
  });
});
