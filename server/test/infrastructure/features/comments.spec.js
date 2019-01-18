import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import GetComments from '../../../src/use_cases/get-comments'
import AddComment from '../../../src/use_cases/add-comment'

describe.skip('Integration | Routes | comments route', () => {
  describe('GET /api/comments/', () => {
    let persistedComments
    beforeEach(() => {
      sinon.stub(GetComments, 'getComments')
      persistedComments = [{ id: 1, text: 'comment' }]
      GetComments.getComments.resolves(persistedComments)
    })

    afterEach(() => {
      GetComments.getComments.restore()
    })

    it('should call GetComments#getComments and return comments', done => {
      // when
      request(app)
        .get('/api/comments')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(GetComments.getComments).to.have.been.calledWith()
          expect(res.body).to.deep.equal(persistedComments)
          done()
        })
    })
  })

  describe('POST /api/comments', () => {
    beforeEach(() => {
      sinon.stub(AddComment, 'addComment')
    })

    afterEach(() => {
      AddComment.addComment.restore()
    })

    it('should call AddComment#addComment and return comment', done => {
      // given
      const persistedComment = { id: 1, text: 'comment' }
      AddComment.addComment.resolves(persistedComment)

      // when
      request(app)
        .post('/api/comments')
        .set('Authorization', 'Bearer access-token')
        .send({ text: 'comment' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(AddComment.addComment).to.have.been.calledWith({ text: 'comment' })
          expect(res.body).to.deep.equal({ id: 1, text: 'comment' })
          done()
        })
    })

    it('should return 400 when add comment throws an error', () => {
      // given
      AddComment.addComment.rejects(new Error('Some error'))

      // when
      return request(app)
        .post('/api/comments')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(400)
    })
  })
})
