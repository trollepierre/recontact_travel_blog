import { expect, sinon } from '../test-helper'

import mailJet from '../../src/infrastructure/mailing/mailjet'
import NotifyTheme from '../../src/use_cases/notify-theme'

describe('Unit | Service | NotifyTheme', () => {
  const theme = {
    previousTheme: 'new',
    newTheme: 'dark',
  }

  beforeEach(() => {
    sinon.stub(mailJet, 'sendEmail')
  })

  afterEach(() => {
    mailJet.sendEmail.restore()
  })

  describe('#notifyThemeEmail', () => {
    it('should send an email with correct data', () => {
      // given
      mailJet.sendEmail.resolves()

      // when
      const promise = NotifyTheme.notifyTheme(theme)

      // then
      return promise.then(() => {
        expect(mailJet.sendEmail).to.have.been.calledWithExactly({
          from: 'contact-localhost@recontact.me',
          to: ['contact-localhost@recontact.me'],
          fromName: 'RecontactMe',
          subject: '[RecontactMe] Un thème a été choisi : dark!',
          template: '<p>Le thème a été changé :</p>\n'
            + '<p>C\'était : new</p>\n'
            + '<p>C\'est   : dark</p>',
        })
      })
    })

    it('should throw error when mailJet rejects', () => {
      // given
      mailJet.sendEmail.rejects(new Error('error'))
      const theme = {
        email: 'mail@recontact.me',
        feedback: 'Long ago in a distant land...',
      }

      // when
      const promise = NotifyTheme.notifyTheme(theme)

      // then
      return promise.catch(err => {
        expect(err.message).to.equal('error')
      })
    })
  })
})
