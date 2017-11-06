const { sinon, expect } = require('../../test-helper');
const subscriptionRepository = require('../../../src/domain/repositories/subscription-repository');
const { Subscription } = require('../../../src/domain/models/index');

describe('Unit | Repository | subscription-repository', () => {
  describe('#addSubscription', () => {
    beforeEach(() => {
      sinon.stub(Subscription, 'findOrCreate');
    });

    afterEach(() => {
      Subscription.findOrCreate.restore();
    });

    it('should call Sequelize Model#findOrCreate (public static) and Bluebird Promise#spread methods', () => {
      // given
      const subscription = {
        username: 'sdepold',
        job: 'Technical Lead JavaScript',
        id: 1,
      };
      const created = true;
      Subscription.findOrCreate.returns({

        // public static method Model#findOrCreate returns a Bluebird promise resolving <model:Model, created:Boolean>
        // this is why we must to make such a "manual stub" here
        // see:
        //   - http://bluebirdjs.com/docs/api/spread.html
        //   - http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-findOrCreate
        spread(cb) {
          return Promise.resolve(cb(subscription, created));
        },
      });

      // when
      const promise = subscriptionRepository.addSubscription('email@mail.com');

      // then
      return promise.then((res) => {
        expect(Subscription.findOrCreate).to.have.been.called;
        expect(res).to.deep.equal({
          subscription: {
            username: 'sdepold',
            job: 'Technical Lead JavaScript',
            id: 1,
          },
          created: true,
        });
      });
    });
  });

  describe('#removeSubscription', () => {
    beforeEach(() => {
      sinon.stub(Subscription, 'destroy').resolves();
    });

    afterEach(() => {
      Subscription.destroy.restore();
    });

    it('should call Sequelize Model#destroy (public static) method', () => {
      // when
      const promise = subscriptionRepository.removeSubscription(123);

      // then
      return promise.then(() => {
        expect(Subscription.destroy).to.have.been.called;
      });
    });
  });

  describe('#getAll', () => {
    beforeEach(() => {
      sinon.stub(Subscription, 'all').resolves();
    });

    afterEach(() => {
      Subscription.all.restore();
    });

    it('should call Sequelize Model#all', () => {
      // when
      const promise = subscriptionRepository.getAll();

      // then
      return promise.then(() => {
        expect(Subscription.all).to.have.been.called;
      });
    });
  });
});

