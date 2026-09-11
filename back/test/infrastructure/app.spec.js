import { expect, request } from '../test-helper'
import app from '../../app'

describe('Integration | app | error handler', () => {
  it('should answer 404 with the error message on an unknown api route', done => {
    request(app)
      .get('/api/does-not-exist')
      .end((err, response) => {
        if (err) {
          done(err)
          return
        }
        expect(response.status).to.equal(404)
        expect(response.body).to.deep.equal({ error: 'Not Found' })
        done()
      })
  })
})
