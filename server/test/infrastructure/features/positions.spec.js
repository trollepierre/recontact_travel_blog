const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const GetLastPosition = require('../../../src/use_cases/get-last-position');
const SetPosition = require('../../../src/use_cases/set-position');

describe('Integration | Routes | positions route', () => {

  describe('GET /api/positions/last', () => {
    let persistedSubscriptions;
    beforeEach(() => {
      sinon.stub(GetLastPosition, 'getLastPosition');
      persistedSubscriptions = [{ id: 1, lastPosition: 'Mexico' }];
      GetLastPosition.getLastPosition.resolves(persistedSubscriptions);
    });

    afterEach(() => {
      GetLastPosition.getLastPosition.restore();
    });

    it('should call GetLastPosition#getLastPosition', (done) => {
      // when
      request(app)
        .get('/api/positions/last')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(GetLastPosition.getLastPosition).to.have.been.calledWith();
          expect(res.body).to.deep.equal(persistedSubscriptions);
          done();
        });
    });
  });

  describe('POST /api/positions', () => {

    beforeEach(() => {
      sinon.stub(SetPosition, 'setPosition');
    });

    afterEach(() => {
      SetPosition.setPosition.restore();
    });

    it('should call SetPosition#setPosition', (done) => {
      // given
      const persistedPosition = { id: 1, lastPosition: 'Mexico' };
      SetPosition.setPosition.resolves({ position: persistedPosition });

      // when
      request(app)
        .post('/api/positions')
        .set('Authorization', 'Bearer access-token')
        .send({ lastPosition: 'Mexico' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(SetPosition.setPosition).to.have.been.calledWith({ lastPosition: "Mexico" });
          expect(res.body).to.deep.equal({ position: { id: 1, lastPosition: "Mexico" } });
          done();
        });
    });

    it('should return 403 when position service throws an error', () => {
      // given
      SetPosition.setPosition.rejects(new Error('Some error'));

      // when
      return request(app)
        .post('/api/positions')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(403);
    });
  });
});
