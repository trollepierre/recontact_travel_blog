import { expect, request } from '../../test-helper'
import app from '../../../app'

describe('Integration | Routes | index route', () => {
  it('should be 404', (done) => {
    request(app)
      .get('/')
      .end((err, response) => {
        expect(response.status).to.equal(404)
        if (err) {
          done(err)
        }
        done()
      })
  })
})
