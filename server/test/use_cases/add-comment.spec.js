import lolex from 'lolex'
import { expect, sinon } from '../test-helper'
import AddComment from '../../src/use_cases/add-comment'
import CommentRepository from '../../src/domain/repositories/comment-repository'

describe.skip('Unit | AddComment | addComment', () => {
  const text = 'comment-1'
  const author = 'moi'
  const datetime = 'some date without in a string'
  const comment = { text, author }
  const persistedComment = { id: 1, text, datetime, author }
  let clock
  const now = '2018-10-20'

  beforeEach(() => {
    sinon.stub(CommentRepository, 'create').resolves(persistedComment)
  })

  afterEach(() => {
    CommentRepository.create.restore()
  })

  beforeEach(() => {
    clock = lolex.install({ now: new Date(now).valueOf() })
  })

  afterEach(() => {
    clock.uninstall()
  })

  it('should call CommentRepository to create comment', () => {
    // when
    AddComment.addComment(comment)

    // then
    expect(CommentRepository.create).to.have.been.calledWith({ ...comment, datetime: new Date() })
  })

  it('should add author when author is undefined', () => {
    // when
    AddComment.addComment({ text })

    // then
    expect(CommentRepository.create).to.have.been.calledWith({ text, author: 'Anonyme', datetime: new Date() })
  })

  it('should add author when author is empty', () => {
    // when
    AddComment.addComment({ text, author: '' })

    // then
    expect(CommentRepository.create).to.have.been.calledWith({ text, author: 'Anonyme', datetime: new Date() })
  })

  it('should return added comment', () => {
    // when
    const promise = AddComment.addComment(comment)

    // then
    return promise.then(returnedComments => {
      expect(returnedComments).to.deep.equal(persistedComment)
    })
  })

  it('should throw error when no comment', () => {
    // when
    try {
      AddComment.addComment()
    } catch (error) {
      // then
      expect(CommentRepository.create).not.to.have.been.calledWith({ ...comment, datetime: new Date() })
      expect(error.message).to.equal('Empty comment')
    }
  })

  it('should throw error when comment text is undefined', () => {
    // when
    try {
      AddComment.addComment({ author: 'toto' })
    } catch (error) {
      // then
      expect(CommentRepository.create).not.to.have.been.calledWith({ ...comment, datetime: new Date() })
      expect(error.message).to.equal('Empty comment')
    }
  })

  it('should throw error when comment text is empty', () => {
    // when
    try {
      AddComment.addComment({ author: 'toto', text: '' })
    } catch (error) {
      // then
      expect(CommentRepository.create).not.to.have.been.calledWith({ ...comment, datetime: new Date() })
      expect(error.message).to.equal('Empty comment')
    }
  })
})

