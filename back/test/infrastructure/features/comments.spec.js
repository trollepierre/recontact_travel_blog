import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import { commentForFront } from '../../fixtures/comments/commentForFront'
import GetAllComments from '../../../src/use_cases/get-all-comments'
import DeleteComment from '../../../src/use_cases/delete-comment'

describe('Integration | Routes | comments route', () => {
  describe('GET /comments', () => {
    let comments

    beforeEach(() => {
      comments = [commentForFront(), commentForFront()]
      sinon.stub(GetAllComments, 'getAllComments').resolves(comments)
    })

    afterEach(() => {
      GetAllComments.getAllComments.restore()
    })

    it('should call GetAllComments to getAllComments before sending json', done => {
      // When
      request(app)
        .get('/api/admin/comments')
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(GetAllComments.getAllComments).to.have.been.calledWith()
          expect(response.body).to.deep.equal(comments)
          if (err) {
            done(err)
          }
          done()
        })
    })
  })

  describe('DELETE /comments', () => {
    const commentId = '1'

    beforeEach(() => {
      sinon.stub(DeleteComment, 'deleteComment').resolves()
    })

    afterEach(() => {
      DeleteComment.deleteComment.restore()
    })

    it('should call DeleteComment to deleteComment with id + resolved with correct status and empty body', done => {
      // When
      request(app)
        .delete(`/api/admin/comments/${commentId}`)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          // Then
          expect(DeleteComment.deleteComment).to.have.been.calledWith(commentId)
          expect(response.body).to.deep.equal({})
          expect(response.status).to.deep.equal(204)
          done()
        })
    })
  })
})
