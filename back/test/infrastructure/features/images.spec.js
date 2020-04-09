import { expect, request } from '../../test-helper'
import app from '../../../app'
import ConvertImage from '../../../src/use_cases/convert-image';

describe('Integration | Routes | index route', () => {
  it('should be 404', done => {
    request(app)
      .get('/api/images')
      .expect('Content-Type', /json/)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, (err, res) => {
        // then
        expect(ConvertImage.convertImage).to.have.been.calledWith()
        // expect(res.body).to.deep.equal(persistedPositions)
        done()
      })
  })
})
