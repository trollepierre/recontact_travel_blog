import { expect, sinon } from '../test-helper'
import GetArticleComments from '../../src/use_cases/get-article-comments'
import CommentRepository from '../../src/domain/repositories/comment-repository'

describe.skip('Unit | GetArticleComments | getArticleComments', () => {
  const comments = [
    { id: 1, text: 'comment-1' },
    { id: 2, text: 'comment-2' },
  ]

  beforeEach(() => {
    sinon.stub(CommentRepository, 'getAll').resolves(comments)
  })

  afterEach(() => {
    CommentRepository.getAll.restore()
  })

  it('should call CommentRepository to getAll comments', () => {
    // when
    GetArticleComments.getArticleComments()

    // then
    expect(CommentRepository.getAll).to.have.been.calledWith()
  })

  it('should return all comments', () => {
    // when
    const promise = GetArticleComments.getArticleComments()

    // then
    return promise.then(returnedComments => {
      expect(returnedComments).to.deep.equal(comments)
    })
  })
})

