const { request, expect, sinon } = require('../../test-helper');
const app = require('../../../app');
const Subscribe = require('../../../src/use_cases/subscribe');
const DeleteSubscription = require('../../../src/use_cases/delete-subscription');
const GetAllSubscriptions = require('../../../src/use_cases/get-all-subscriptions');

describe('Integration | Routes | subscriptions route', () => {
  describe('POST /api/subscriptions', () => {
    const email = 'mail@recontact.me';

    beforeEach(() => {
      sinon.stub(Subscribe, 'subscribe');
    });

    afterEach(() => {
      Subscribe.subscribe.restore();
    });

    it('should call Subscribe#subscribe', (done) => {
      // given
      const persistedSubscription = { id: 1, email: 'mail@recontact.me' };
      Subscribe.subscribe.resolves({ subscription: persistedSubscription, created: false });

      // when
      request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send({ email })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(Subscribe.subscribe).to.have.been.calledWith('mail@recontact.me');
          expect(res.body).to.deep.equal(persistedSubscription);
          done();
        });
    });

    it('should return 200 when a subscription already exists', () => {
      // given
      Subscribe.subscribe.resolves({ subscription: {}, created: false });

      // when
      return request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send({ email })
        .expect(200);
    });

    it('should return 201 when the subscription did not exist for the given email', () => {
      // given
      Subscribe.subscribe.resolves({ subscription: {}, created: true });

      // when
      return request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(201);
    });

    it('should return 403 when subscription service throws an error', () => {
      // given
      Subscribe.subscribe.rejects(new Error('Some error'));

      // when
      return request(app)
        .post('/api/subscriptions')
        .set('Authorization', 'Bearer access-token')
        .send()
        .expect(403);
    });
  });

  describe('DELETE /api/subscriptions/:subscription_id', () => {
    beforeEach(() => {
      sinon.stub(DeleteSubscription, 'deleteSubscription').resolves();
    });

    afterEach(() => {
      DeleteSubscription.deleteSubscription.restore();
    });

    it('should call subscriptionService#deleteById', (done) => {
      // when
      request(app)
        .delete('/api/subscriptions/1234')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(204, () => {
          // then
          expect(DeleteSubscription.deleteSubscription).to.have.been.calledWith(1234);
          done();
        });
    });
  });

  describe('GET /api/subscriptions/', () => {
    let persistedSubscriptions;
    beforeEach(() => {
      sinon.stub(GetAllSubscriptions, 'getAllSubscriptions');
      persistedSubscriptions = [{ id: 1, email: 'mail@recontact.me' }];
      GetAllSubscriptions.getAllSubscriptions.resolves(persistedSubscriptions);
    });

    afterEach(() => {
      GetAllSubscriptions.getAllSubscriptions.restore();
    });

    it('should call subscriptionService#getAll', (done) => {
      // when
      request(app)
        .get('/api/subscriptions/')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, (err, res) => {
          // then
          expect(GetAllSubscriptions.getAllSubscriptions).to.have.been.calledWith();
          expect(res.body).to.deep.equal(persistedSubscriptions);
          done();
        });
    });
  });
});
