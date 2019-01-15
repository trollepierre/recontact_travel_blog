import nodeMailjet from 'node-mailjet'
import { expect, sinon } from '../../test-helper'
import Mailjet from '../../../src/infrastructure/mailing/mailjet'

describe('Unit | Infrastructure | Mailing | Mailjet', () => {
  let mailJetConnectStub

  beforeEach(() => {
    mailJetConnectStub = sinon.stub(nodeMailjet, 'connect')
  })

  afterEach(() => {
    mailJetConnectStub.restore()
  })

  describe('#sendEmail', () => {
    let options

    beforeEach(() => {
      options = {
        from: 'contact@recontact.me',
        fromName: 'Ne pas répondre',
        subject: 'mon sujet',
        template: 'Corps du mail',
        to: 'contact@recontact.me',
      }
    })

    it('should create an instance of mailJet', () => {
      // Given
      mailJetConnectStub.returns({
        post: () => ({
          request: () => {
          },
        }),
      })

      // When
      Mailjet.sendEmail(options)

      // Then
      sinon.assert.calledWith(mailJetConnectStub, 'fake-mailjet-public-key', 'fake-mailjet-secret-key')
    })

    it('should post a send instruction', () => {
      // Given
      const postStub = sinon.stub().returns({ request: () => Promise.resolve() })
      mailJetConnectStub.returns({ post: postStub })

      // When
      const result = Mailjet.sendEmail(options)

      // Then
      return result.then(() => {
        sinon.assert.calledWith(postStub, 'send')
      })
    })

    it('should request with a payload', () => {
      // Given
      const requestStub = sinon.stub().returns(Promise.resolve())
      const postStub = sinon.stub().returns({ request: requestStub })
      mailJetConnectStub.returns({ post: postStub })

      // When
      const result = Mailjet.sendEmail(options)

      // Then
      return result.then(() => {
        sinon.assert.calledWith(requestStub, {
          FromEmail: 'contact@recontact.me',
          FromName: 'Ne pas répondre',
          Subject: 'mon sujet',
          'Html-part': 'Corps du mail',
          Recipients: [{ Email: 'contact@recontact.me' }],
        })
      })
    })

    describe('#_formatRecipients', () => {
      let requestStub
      let postStub

      beforeEach(() => {
        requestStub = sinon.stub().returns(Promise.resolve())
        postStub = sinon.stub().returns({ request: requestStub })
        mailJetConnectStub.returns({ post: postStub })

        options = {
          from: 'from',
          fromName: 'name',
          subject: 'subject',
          template: 'body',
          to: null,
        }
      })

      it('should take into account when specified receivers is null or undefined', () => {
        // given
        options.to = null

        // when
        const result = Mailjet.sendEmail(options)

        // then
        return result.then(() => {
          expect(mailJetConnectStub).not.to.have.been.calledWith()
        })
      })

      it('should take into account when specified receivers is a string with single email', () => {
        // given
        options.to = 'recipient@mail.com'

        // when
        const result = Mailjet.sendEmail(options)

        // then
        return result.then(() => {
          sinon.assert.calledWithExactly(requestStub, {
            FromEmail: 'from',
            FromName: 'name',
            Subject: 'subject',
            'Html-part': 'body',
            Recipients: [{ Email: 'recipient@mail.com' }],
          })
        })
      })

      it('should take into account when specified receivers is an array of receivers', () => {
        // given
        options.to = ['recipient_1@mail.com', 'recipient_2@mail.com', 'recipient_3@mail.com']

        // when
        const result = Mailjet.sendEmail(options)

        // then
        return result.then(() => {
          sinon.assert.calledWithExactly(requestStub, {
            FromEmail: 'from',
            FromName: 'name',
            Subject: 'subject',
            'Html-part': 'body',
            Recipients: [
              { Email: 'recipient_1@mail.com' },
              { Email: 'recipient_2@mail.com' },
              { Email: 'recipient_3@mail.com' },
            ],
          })
        })
      })
    })
  })
})
