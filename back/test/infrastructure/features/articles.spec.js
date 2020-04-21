import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import GetPhotosOfArticle from '../../../src/use_cases/get-article-photos'
import GetAllArticles from '../../../src/use_cases/get-all-articles'
import GetArticle from '../../../src/use_cases/get-article'
import article from '../../fixtures/articleSaved'
import chapter from '../../fixtures/chapterWithParagraphs'
import photo from '../../fixtures/photo'
import GetArticleComments from '../../../src/use_cases/get-article-comments'
import AddComment from '../../../src/use_cases/add-comment'
import { commentForFront } from '../../fixtures/comments/commentForFront'

describe('Integration | Routes | articles route', () => {
  describe('GET /articles', () => {
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

  describe('GET /articles/:id', () => {
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

  describe('GET /articles/:id/photos', () => {
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

  describe('GET /articles/:id/comments', () => {
    const comments = [{ author: 'name', date: '2019' }]
    beforeEach(() => {
      sinon.stub(GetArticleComments, 'getArticleComments').resolves(comments)
    })

    afterEach(() => {
      GetArticleComments.getArticleComments.restore()
    })

    it('should call GetArticleComments to getArticleComments before sending json', done => {
      // Given
      const stringIdArticle = '59'

      // When
      request(app)
        .get(`/api/articles/${stringIdArticle}/comments`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetArticleComments.getArticleComments).to.have.been.calledWith(stringIdArticle)
          expect(response.body).to.deep.equal(comments)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('POST /articles/:id/comments', () => {
    const createdComment = commentForFront()

    afterEach(() => {
      AddComment.addComment.restore()
    })

    it('should call AddComment to addComment before sending json', done => {
      // Given
      sinon.stub(AddComment, 'addComment').resolves(createdComment)
      const stringIdArticle = '59'
      const body = { author: 'name', text: 'comment' }

      // When
      request(app)
        .post(`/api/articles/${stringIdArticle}/comments`)
        .send(body)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(AddComment.addComment).to.have.been.calledWith(body, stringIdArticle)
          expect(response.body).to.deep.equal(createdComment)
          if (err) {
            done(err)
          }
          done()
        })
    })

    it('should handle error', done => {
      // Given
      sinon.stub(AddComment, 'addComment').rejects('error')
      const stringIdArticle = '59'
      const body = { author: 'name', text: 'comment' }

      // When
      request(app)
        .post(`/api/articles/${stringIdArticle}/comments`)
        .send(body)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(response.status).to.equal(400)
          expect(response.body).to.deep.equal({ name: 'error' })
          if (err) {
            done(err)
          }
          done()
        })
    })
  })
})
