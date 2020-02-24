import { expect, sinon } from '../test-helper'
import GetArticleComments from '../../src/use_cases/get-article-comments'
import CommentRepository from '../../src/domain/repositories/comment-repository'

describe('Unit | GetArticleComments | getArticleComments', () => {
  const comments = [
    { id: 1, text: 'comment-1', createdAt: '2020-01-15T12:26:45.887Z' },
    { id: 2, text: 'comment-2', createdAt: '2020-01-15T12:26:45.887Z' },
  ]
  const expectedComments = [
    { id: 1, text: 'comment-1', createdAt: '15/01/2020 13:26' },
    { id: 2, text: 'comment-2', createdAt: '15/01/2020 13:26' },
  ]

  beforeEach(() => {
    sinon.stub(CommentRepository, 'getAllById').resolves(comments)
  })

  afterEach(() => {
    CommentRepository.getAllById.restore()
  })

  it('should call CommentRepository to getAllById comments', () => {
    // when
    GetArticleComments.getArticleComments()

    // then
    expect(CommentRepository.getAllById).to.have.been.calledWith()
  })

  it('should return all comments', () => {
    // when
    const promise = GetArticleComments.getArticleComments()

    // then
    return promise.then(returnedComments => {
      expect(returnedComments).to.deep.equal(expectedComments)
    })
  })
})

