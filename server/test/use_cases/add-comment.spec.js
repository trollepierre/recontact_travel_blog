// import lolex from 'lolex'
import { expect, sinon } from '../test-helper'
import AddComment from '../../src/use_cases/add-comment'
import CommentRepository from '../../src/domain/repositories/comment-repository'
import mailJet from '../../src/infrastructure/mailing/mailjet'

describe('Unit | AddComment | addComment', () => {
  const text = 'comment-1'
  const author = 'moi'
  const datetime = 'some date without in a string'
  const comment = { text, author }
  const persistedComment = { id: 1, text, datetime, author }
  // let clock
  // const now = '2018-10-20'
  const dropboxId = '48'

  beforeEach(() => {
    sinon.stub(CommentRepository, 'create').resolves(persistedComment)
    sinon.stub(mailJet, 'sendEmail').resolves()
  })

  afterEach(() => {
    CommentRepository.create.restore()
    mailJet.sendEmail.restore()
  })

  // beforeEach(() => {
  //   clock = lolex.install({ now: new Date(now).valueOf() })
  // })
  //
  // afterEach(() => {
  //   clock.uninstall()
  // })

  it('should call CommentRepository to create comment', () => {
    // when
    AddComment.addComment(comment, dropboxId)

    // then
    expect(CommentRepository.create).to.have.been.calledWith({ ...comment, dropboxId })
  })

  it('should add author when author is undefined', () => {
    // when
    AddComment.addComment({ text }, dropboxId)

    // then
    expect(CommentRepository.create).to.have.been.calledWith({ text, author: 'Anonyme', dropboxId })
  })

  it('should add author when author is empty', () => {
    // when
    AddComment.addComment({ text, author: '' }, dropboxId)

    // then
    expect(CommentRepository.create).to.have.been.calledWith({ text, author: 'Anonyme', dropboxId })
  })

  it('should return added comment', () => {
    // when
    const promise = AddComment.addComment(comment, dropboxId)

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
      expect(CommentRepository.create).not.to.have.been.calledWith({ ...comment, dropboxId })
      expect(error.message).to.equal('Empty comment')
    }
  })

  it('should throw error when comment text is undefined', () => {
    // when
    try {
      AddComment.addComment({ author: 'toto' })
    } catch (error) {
      // then
      expect(CommentRepository.create).not.to.have.been.calledWith({ ...comment, dropboxId })
      expect(error.message).to.equal('Empty comment')
    }
  })

  it('should throw error when comment text is empty', () => {
    // when
    try {
      AddComment.addComment({ author: 'toto', text: '' })
    } catch (error) {
      // then
      expect(CommentRepository.create).not.to.have.been.calledWith({ ...comment, dropboxId })
      expect(error.message).to.equal('Empty comment')
    }
  })

  it('should send email with comment to MAIL_TO', async () => {
    // when
    await AddComment.addComment({ author: 'toto', text: 'my text' }, '65')

    // then
    expect(mailJet.sendEmail).to.have.been.calledWith({
      from: 'contact@recontact.me',
      fromName: 'RecontactMe',
      subject: '[RecontactMe] Un nouveau commentaire a été publié par moi!',
      template: `<p>Voici le message :</p>
<p>comment-1</p>
<p>Article concerné : 65</p>`,
      to: ['contact@recontact.me'],
    })
  })
})

