const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const GetPhotosOfArticle = require('../../../src/use_cases/get-photos-of-article');
const GetAllArticles = require('../../../src/use_cases/get-all-articles');
const GetArticle = require('../../../src/use_cases/get-article');
const article = require('../../fixtures/articleSaved');
const chapter = require('../../fixtures/chapterWithParagraphs');
const photo = require('../../fixtures/photo');

describe('Integration | Routes | articles route', () => {
  describe('/articles', () => {
    let articles;

    beforeEach(() => {
      articles = [article(), article()];
      sinon.stub(GetAllArticles, 'getAllArticles').resolves(articles);
    });

    afterEach(() => {
      GetAllArticles.getAllArticles.restore();
    });

    it('should call GetAllArticles to getAllArticles before sending json', (done) => {
      // When
      request(app)
        .get('/api/articles')
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetAllArticles.getAllArticles).to.have.been.called;
          expect(response.body).to.deep.equal(articles);
          if (err) {
            done(err);
          }
          done();
        });
    });
  });

  describe('/articles/:id', () => {
    const chapters = [chapter(), chapter()];
    beforeEach(() => {
      sinon.stub(GetArticle, 'getAllChapters').resolves(chapters);
    });

    afterEach(() => {
      GetArticle.getAllChapters.restore();
    });

    it('should call ChapterRepository to getChaptersOfArticle before sending json', (done) => {
      // Given
      const stringIdArticle = '59';

      // When
      request(app)
        .get(`/api/articles/${stringIdArticle}`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetArticle.getAllChapters).to.have.been.calledWith(stringIdArticle);
          expect(response.body).to.deep.equal(chapters);
          if (err) {
            done(err);
          }
          done();
        });
    });
  });

  describe('/articles/:id/photos', () => {
    const photos = [photo(), photo()];
    beforeEach(() => {
      sinon.stub(GetPhotosOfArticle, 'getAllPhotos').resolves(photos);
    });

    afterEach(() => {
      GetPhotosOfArticle.getAllPhotos.restore();
    });

    it('should call GetPhotosOfArticle to getAllPhotos before sending json', (done) => {
      // Given
      const stringIdArticle = '59';

      // When
      request(app)
        .get(`/api/articles/${stringIdArticle}/photos`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetPhotosOfArticle.getAllPhotos).to.have.been.calledWith(stringIdArticle);
          expect(response.body).to.deep.equal(photos);
          if (err) {
            done(err);
          }
          done();
        });
    });
  });
});
