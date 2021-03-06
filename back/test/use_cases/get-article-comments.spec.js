import lolex from '@sinonjs/fake-timers'
import { expect, sinon } from '../test-helper'
import GetArticleComments from '../../src/use_cases/get-article-comments'
import CommentRepository from '../../src/domain/repositories/comment-repository'

describe('Unit | GetArticleComments | getArticleComments', () => {
  const now = '2018-07-21T10:00:00'
  let clock

  beforeEach(() => {
    clock = lolex.install({ now: new Date(now).valueOf() })
  })

  afterEach(() => {
    clock.uninstall()
  })

  const comments = [
    { id: 1, text: 'comment-1', createdAt: '2020-01-15T12:26:45.887Z' },
    { id: 2, text: 'comment-2', createdAt: '2020-01-15T12:26:45.887Z' },
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
      expect(returnedComments).to.deep.equal(comments)
    })
  })
})

