import { expect, sinon } from '../test-helper'
import AddComment from '../../src/use_cases/add-comment'
import CommentRepository from '../../src/domain/repositories/comment-repository'

describe('Unit | AddComment | addComment', () => {
  const comment = { text: 'comment-1' }
  const persistedComment = { id: 1, text: 'comment-1' }

  beforeEach(() => {
    sinon.stub(CommentRepository, 'create').resolves(persistedComment)
  })

  afterEach(() => {
    CommentRepository.create.restore()
  })

  it('should call CommentRepository to create comment', () => {
    // when
    AddComment.addComment(comment)

    // then
    expect(CommentRepository.create).to.have.been.calledWith(comment)
  })

  it('should return added comment', () => {
    // when
    const promise = AddComment.addComment(comment)

    // then
    return promise.then(returnedComments => {
      expect(returnedComments).to.deep.equal(persistedComment)
    })
  })
})

