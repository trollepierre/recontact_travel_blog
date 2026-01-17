import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import UpdatePhotos from '../../../src/use_cases/update-photos'
import UpdateChapter from '../../../src/use_cases/update-chapter'
import UpdateArticle from '../../../src/use_cases/update-article'
import UpdateArticles from '../../../src/use_cases/update-articles'

describe('Integration | Routes | admin route', () => {
  describe('/admin/articles/:id', () => {
    beforeEach(() => {
      sinon.stub(UpdateArticle, 'sync').resolves()
    })

    afterEach(() => {
      UpdateArticle.sync.restore()
    })

    it('should call update article and send 204', done => {
      // Given
      const stringIdArticle = '59'

      // When
      request(app)
        .patch(`/api/admin/articles/${stringIdArticle}`)
        .end((err, response) => {
          // Then
          expect(UpdateArticle.sync).to.have.been.calledWith(stringIdArticle)
          expect(response.status).to.deep.equal(204)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('/admin/articles/', () => {
    beforeEach(() => {
      sinon.stub(UpdateArticles, 'sync').resolves()
    })

    afterEach(() => {
      UpdateArticles.sync.restore()
    })

    it('should call update articles and send 204', done => {
      // When
      request(app)
        .patch('/api/admin/articles')
        .end((err, response) => {
          // Then
          expect(UpdateArticles.sync).to.have.been.calledWith()
          expect(response.status).to.deep.equal(204)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('/admin/articles/:id/chapters/:position', () => {
    beforeEach(() => {
      sinon.stub(UpdateChapter, 'sync').resolves()
    })

    afterEach(() => {
      UpdateChapter.sync.restore()
    })

    it('should call update article and send 204', done => {
      // Given
      const stringIdArticle = '59'
      const position = '3'

      // When
      request(app)
        .patch(`/api/admin/articles/${stringIdArticle}/chapters/${position}`)
        .end((err, response) => {
          // Then
          expect(UpdateChapter.sync).to.have.been.calledWith({ dropboxId: stringIdArticle, chapterPosition: position })
          expect(response.status).to.deep.equal(204)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('/admin/articles/:id/photos', () => {
    beforeEach(() => {
      sinon.stub(UpdatePhotos, 'sync').resolves()
    })

    afterEach(() => {
      UpdatePhotos.sync.restore()
    })

    it('should call update photos and send 204', done => {
      // Given
      const stringIdArticle = '59'

      // When
      request(app)
        .patch(`/api/admin/articles/${stringIdArticle}/photos`)
        .end((err, response) => {
          // Then
          expect(UpdatePhotos.sync).to.have.been.calledWith({ dropboxId: stringIdArticle })
          expect(response.status).to.deep.equal(204)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })
})
