const { request } = require('../../test-helper');
const app = require('../../../app');

describe('Integration | Routes | index route', () => {
  it('should have api informations on root', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .end((err) => {
        if (err) {
          done(err);
        }
        done();
      });
  });
});
