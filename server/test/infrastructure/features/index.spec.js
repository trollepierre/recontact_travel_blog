const { request, expect } = require('../../test-helper')
const app = require('../../../app')

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
