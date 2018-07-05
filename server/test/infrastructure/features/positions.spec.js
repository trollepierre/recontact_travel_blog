const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const GetLastPosition = require('../../../src/use_cases/get-last-position');
const AddPosition = require('../../../src/use_cases/add-position');

describe('Integration | Routes | positions route', () => {
  describe('GET /api/positions/last', () => {
    let persistedPositions;
    beforeEach(() => {
      sinon.stub(GetLastPosition, 'getLastPosition');
      persistedPositions = [{ id: 1, lastPosition: 'Mexico' }];
      GetLastPosition.getLastPosition.resolves(persistedPositions);
    });

    afterEach(() => {
      GetLastPosition.getLastPosition.restore();
    });

    it('should call GetLastPosition#getLastPosition and return position', (done) => {
      // when
      request(app)
        .get('/api/positions/last')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(GetLastPosition.getLastPosition).to.have.been.calledWith();
          expect(res.body).to.deep.equal(persistedPositions);
          done();
        });
    });
  });

  describe('POST /api/positions', () => {
    beforeEach(() => {
      sinon.stub(AddPosition, 'addPosition');
    });

    afterEach(() => {
      AddPosition.addPosition.restore();
    });

    it('should call AddPosition#addPosition and return position', (done) => {
      // given
      const persistedPosition = { id: 1, lastPosition: 'Mexico' };
      AddPosition.addPosition.resolves({ position: persistedPosition });

      // when
      request(app)
        .post('/api/positions')
        .set('Authorization', 'Bearer access-token')
        .send({ lastPosition: 'Mexico' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(AddPosition.addPosition).to.have.been.calledWith({ lastPosition: 'Mexico' });
          expect(res.body).to.deep.equal({ position: { id: 1, lastPosition: 'Mexico' } });
          done();
        });
    });

    it('should return 403 when add position throws an error', () => {
      // given
      AddPosition.addPosition.rejects(new Error('Some error'));

      // when
      return request(app)
        .post('/api/positions')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(403);
    });
  });
});
