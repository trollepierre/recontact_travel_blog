import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import NotifyTheme from '../../../src/use_cases/notify-theme'

describe('Integration | Routes | theme route', () => {
  afterEach(() => {
    NotifyTheme.notifyTheme.restore()
  })

  it('should return "Synchronization successful" message', done => {
    // Given
    sinon.stub(NotifyTheme, 'notifyTheme').resolves('ok')
    // When
    request(app)
      .post('/api/theme')
      .end((err, response) => {
        // Then
        expect(response.status).to.equal(201)
        expect(response.body).to.equal('ok')
        if (err) {
          done(err)
        }
        done()
      })
  })
})
