const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const GetAllArticles = require('../../../src/use_cases/get-all-articles');
const GetArticle = require('../../../src/use_cases/get-article');
const article = require('../../fixtures/articleSaved');
const chapter = require('../../fixtures/chapterWithParagraphs');

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
      sinon.stub(GetArticle, 'getArticle').resolves(chapters);
    });

    afterEach(() => {
      GetArticle.getArticle.restore();
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
          expect(GetArticle.getArticle).to.have.been.calledWith(stringIdArticle);
          expect(response.body).to.deep.equal(chapters);
          if (err) {
            done(err);
          }
          done();
        });
    });
  });
});
