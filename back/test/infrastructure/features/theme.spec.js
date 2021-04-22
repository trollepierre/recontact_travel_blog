import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import NotifyTheme from '../../../src/use_cases/notify-theme'

describe('Integration | Routes | theme route', () => {
  afterEach(() => {
    NotifyTheme.notifyTheme.restore()
  })

  it('should return "Synchronization successful" message', done => {
    // Given
    const theme = 'light'
    sinon.stub(NotifyTheme, 'notifyTheme').resolves(theme)

    // When
    request(app)
      .post('/api/theme')
      .send({ theme })
      .end((err, response) => {
        // Then
        expect(NotifyTheme.notifyTheme).to.be.calledWith({ theme })
        expect(response.status).to.equal(201)
        expect(response.body).to.equal(theme)
        if (err) {
          done(err)
        }
        done()
      })
  })
})
