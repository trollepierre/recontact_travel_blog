import { expect, request, sinon } from '../../test-helper'
import app from '../../../app'
import SynchronizeArticles from '../../../src/use_cases/synchronize-articles'

describe('Integration | Routes | index route', () => {
  afterEach(() => {
    SynchronizeArticles.synchronizeArticles.restore()
  })

  it('should return "Synchronization successful" message', done => {
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

  it('should be 500', done => {
    // Given
    const error = { err: 'Some error' }
    sinon.stub(SynchronizeArticles, 'synchronizeArticles').rejects(error)
    // When
    request(app)
      .patch('/api/sync')
      .end((err, response) => {
        // Then
        expect(response.status).to.equal(500)
        expect(response.body).to.deep.equal(error)
        done()
      })
  })
})
