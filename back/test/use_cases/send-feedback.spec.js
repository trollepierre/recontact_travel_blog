import { expect, sinon } from '../test-helper'

import mailJet from '../../src/infrastructure/mailing/mailjet'
import sendFeedback from '../../src/use_cases/send-feedback'

describe('Unit | Service | SendFeedback', () => {
  beforeEach(() => {
    sinon.stub(mailJet, 'sendEmail')
  })

  afterEach(() => {
    mailJet.sendEmail.restore()
  })

  describe('#sendFeedbackEmail', () => {
    it('should send an email with correct options', () => {
      // given
      mailJet.sendEmail.resolves()
      const form = {
        email: 'mail@recontact.me',
        feedback: 'Long ago in a distant land...',
      }

      // when
      const promise = sendFeedback.sendFeedbackEmail(form)

      // then
      return promise.then(() => {
        expect(mailJet.sendEmail).to.have.been.calledWithExactly({
          from: 'contact-localhost@recontact.me',
          to: 'contact-localhost@recontact.me',
          fromName: 'RecontactMe - Ne pas répondre',
          subject: '[RecontactMe] [Support] mail@recontact.me a émis un message',
          template: 'Long ago in a distant land...',
        })
      })
    })

    it('should throw error when mailJet rejects', () => {
      // given
      mailJet.sendEmail.rejects(new Error('error'))
      const form = {
        email: 'mail@recontact.me',
        feedback: 'Long ago in a distant land...',
      }

      // when
      const promise = sendFeedback.sendFeedbackEmail(form)

      // then
      return promise.catch(err => {
        expect(err.message).to.equal('error')
      })
    })
  })
})
