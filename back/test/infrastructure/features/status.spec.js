import { expect, request } from '../../test-helper'
import app from '../../../app'

describe('Integration | Routes | status route', () => {
  it('should be 200', done => {
    request(app)
      .get('/status')
      .end((err, response) => {
        expect(response.status).to.equal(200)
        if (err) {
          done(err)
        }
        done()
      })
  })
  it('should be 200 with /api', done => {
    request(app)
      .get('/api/status')
      .end((err, response) => {
        expect(response.status).to.equal(200)
        if (err) {
          done(err)
        }
        done()
      })
  })
})
