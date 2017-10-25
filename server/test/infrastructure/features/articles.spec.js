const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const GetAllArticles = require('../../../src/use_cases/get-all-articles');
const GetArticle = require('../../../src/use_cases/get-article');
const articles = require('../../fixtures/articlesWithSharedLink');
const chapters = require('../../fixtures/chaptersWithParagraphs');

describe('Integration | Routes | articles route', () => {
  describe('/articles', () => {
    beforeEach(() => {
      sinon.stub(GetAllArticles, 'getAllArticles').resolves(articles());
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
          expect(response.body).to.deep.equal(articles());
          if (err) {
            done(err);
          }
          done();
        });
    });
  });

  describe('/articles/:id', () => {
    beforeEach(() => {
      sinon.stub(GetArticle, 'getAllChapters').resolves(chapters());
    });

    afterEach(() => {
      GetArticle.getAllChapters.restore();
    });

    it('should call ChapterRepository to getChaptersOfArticle, serialize it before sending json', (done) => {
      // Given
      const stringIdArticle = '59';

      // When
      request(app)
        .get(`/api/articles/${stringIdArticle}`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetArticle.getAllChapters).to.have.been.calledWith(stringIdArticle);
          expect(response.body).to.deep.equal(chapters());
          if (err) {
            done(err);
          }
          done();
        });
    });
  });
});
