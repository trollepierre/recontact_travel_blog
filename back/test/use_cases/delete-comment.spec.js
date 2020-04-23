import { expect, sinon } from '../test-helper'
import DeleteComment from '../../src/use_cases/delete-comment'
import CommentRepository from '../../src/domain/repositories/comment-repository'

describe('Unit | DeleteComment | deleteComment', () => {
  beforeEach(() => {
    sinon.stub(CommentRepository, 'deleteById').resolves({})
  })

  afterEach(() => {
    CommentRepository.deleteById.restore()
  })

  it('should call CommentRepository to deleteById and return empty', () => {
    // when
    const promise = DeleteComment.deleteComment()

    // then
    expect(CommentRepository.deleteById).to.have.been.calledWith()
    return promise.then(returnedComments => {
      expect(returnedComments).to.deep.equal({})
    })
  })
})

