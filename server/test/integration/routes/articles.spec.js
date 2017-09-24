const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const DropboxClient = require('../../../src/infrastructure/dropbox');
const File = require('../../../src/infrastructure/file');
const ArticlesSerializer = require('../../../src/serializers/articles');
const ChaptersSerializer = require('../../../src/serializers/chapters');

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

  describe('/articles', () => {
    beforeEach(() => {
      sinon.stub(DropboxClient, 'getAllFileMetaDataInDropbox').resolves();
      sinon.stub(ArticlesSerializer, 'serialize').returns(expectedArticles);
      sinon.stub(DropboxClient, 'shareImages').returns(expectedArticles);
    });

    afterEach(() => {
      DropboxClient.getAllFileMetaDataInDropbox.restore();
      ArticlesSerializer.serialize.restore();
      DropboxClient.shareImages.restore();
    });

    it('should call DropboxClient to getAllFileMetaData and serialize and shareImages from Dropbox before sending json', (done) => {
      // When
      request(app)
        .get('/api/articles')
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(DropboxClient.getAllFileMetaDataInDropbox).to.have.been.called;
          expect(ArticlesSerializer.serialize).to.have.been.called;
          expect(DropboxClient.shareImages).to.have.been.calledWith(expectedArticles);
          expect(response.body).to.deep.equal(expectedArticles);
          if (err) {
            done(err);
          }
          done();
        });
    });
  });

  describe('/articles/:id', () => {
    beforeEach(() => {
      sinon.stub(DropboxClient, 'getFileContentStream').resolves();
      sinon.stub(File, 'read').returns('rawFile');
      sinon.stub(ChaptersSerializer, 'serialize').returns('chapters');
      sinon.stub(DropboxClient, 'shareChapterImages').returns('chaptersReadyToShare');
    });

    afterEach(() => {
      DropboxClient.getFileContentStream.restore();
      File.read.restore();
      ChaptersSerializer.serialize.restore();
      DropboxClient.shareChapterImages.restore();
    });

    it('should call DropboxClient to getFileContentStream, read and serialize it and shareChapterImages from Dropbox before sending json', (done) => {
      // Given
      const idArticle = 59;
      const stringIdArticle = '59';

      // When
      request(app)
        .get(`/api/articles/${idArticle}`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(DropboxClient.getFileContentStream).to.have.been.calledWith(stringIdArticle);
          expect(File.read).to.have.been.called;
          expect(ChaptersSerializer.serialize).to.have.been.calledWith('rawFile');
          expect(DropboxClient.shareChapterImages).to.have.been.calledWith('chapters', stringIdArticle);
          expect(response.body).to.deep.equal('chaptersReadyToShare');
          if (err) {
            done(err);
          }
          done();
        });
    });
  });
});
