import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import GetPhotosOfArticle from '../../../src/use_cases/get-article-photos'
import GetAllArticles from '../../../src/use_cases/get-all-articles'
import GetArticle from '../../../src/use_cases/get-article'
import article from '../../fixtures/articleSaved'
import chapter from '../../fixtures/chapterWithParagraphs'
import photo from '../../fixtures/photo'

describe('Integration | Routes | articles route', () => {
  describe('/articles', () => {
    let articles

    beforeEach(() => {
      articles = [article(), article()]
      sinon.stub(GetAllArticles, 'getAllArticles').resolves(articles)
    })

    afterEach(() => {
      GetAllArticles.getAllArticles.restore()
    })

    it('should call GetAllArticles to getAllArticles before sending json', done => {
      // When
      request(app)
        .get('/api/articles')
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetAllArticles.getAllArticles).to.have.been.called
          expect(response.body).to.deep.equal(articles)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('/articles/:id', () => {
    const chapters = [chapter(), chapter()]
    beforeEach(() => {
      sinon.stub(GetArticle, 'getArticle').resolves(chapters)
    })

    afterEach(() => {
      GetArticle.getArticle.restore()
    })

    it('should call ChapterRepository to getChaptersOfArticle before sending json', done => {
      // Given
      const stringIdArticle = '59'

      // When
      request(app)
        .get(`/api/articles/${stringIdArticle}`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetArticle.getArticle).to.have.been.calledWith(stringIdArticle)
          expect(response.body).to.deep.equal(chapters)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('/articles/:id/photos', () => {
    const photos = [photo(), photo()]
    beforeEach(() => {
      sinon.stub(GetPhotosOfArticle, 'getArticlePhotos').resolves(photos)
    })

    afterEach(() => {
      GetPhotosOfArticle.getArticlePhotos.restore()
    })

    it('should call GetArticlePhotos to getArticlePhotos before sending json', done => {
      // Given
      const stringIdArticle = '59'

      // When
      request(app)
        .get(`/api/articles/${stringIdArticle}/photos`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetPhotosOfArticle.getArticlePhotos).to.have.been.calledWith(stringIdArticle)
          expect(response.body).to.deep.equal(photos)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })
})
