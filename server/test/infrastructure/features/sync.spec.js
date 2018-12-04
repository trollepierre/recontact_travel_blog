import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import SynchronizeArticles from '../../../src/use_cases/synchronize-articles'

describe('Integration | Routes | index route', () => {
  afterEach(() => {
    SynchronizeArticles.synchronizeArticles.restore()
  })

  it('should return "Synchronization successful" message', (done) => {
    // Given
    sinon.stub(SynchronizeArticles, 'synchronizeArticles').resolves()
    // When
    request(app)
      .patch('/api/sync')
      .end((err, response) => {
        // Then
        expect(response.body).to.equal('Synchronization successful.')
        if (err) {
          done(err)
        }
        done()
      })
  })

  // TODO fix that test
  it.skip('should be 500', (done) => {
    // Given
    sinon.stub(SynchronizeArticles, 'synchronizeArticles').rejects(new Error('Some error'))
    // When
    request(app)
      .patch('/api/sync')
      .end((err, response) => {
        // Then
        if (err) {
          expect(response.status).to.equal(500)
          expect(response.body).to.equal('Synchronization failed :', err)
          done(err)
        }
        done()
      })
  })
})
