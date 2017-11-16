const { sinon, expect } = require('../../test-helper');
const subscriptionRepository = require('../../../src/domain/repositories/subscription-repository');
const { Subscription } = require('../../../src/domain/models/index');

describe('Unit | Repository | subscription-repository', () => {
  describe('#create', () => {
    beforeEach(() => {
      sinon.stub(Subscription, 'create');
    });

    afterEach(() => {
      Subscription.create.restore();
    });

    it('should call Sequelize Model#create (public static)', () => {
      // given
      const subscription = {
        email: 'email@mail.com',
        id: 1,
      };
      Subscription.create.resolves(subscription);

      // when
      const promise = subscriptionRepository.create('email@mail.com');

      // then

      return promise.then((res) => {
        expect(Subscription.create).to.have.been.calledWith({ email: 'email@mail.com' });
        expect(res).to.deep.equal(subscription);
      });
    });
  });

  describe('#findOne', () => {
    beforeEach(() => {
      sinon.stub(Subscription, 'findOne');
    });

    afterEach(() => {
      Subscription.findOne.restore();
    });

    it('should call Sequelize Model#findOne (public static)', () => {
      // given
      const subscription = {
        email: 'email@mail.com',
        id: 1,
      };
      Subscription.findOne.resolves(subscription);

      // when
      const promise = subscriptionRepository.getByEmail('email@mail.com');

      // then

      return promise.then((res) => {
        expect(Subscription.findOne).to.have.been.calledWith({ where: { email: 'email@mail.com' } });
        expect(res).to.deep.equal(subscription);
      });
    });
  });

  describe('#deleteById', () => {
    beforeEach(() => {
      sinon.stub(Subscription, 'destroy').resolves();
    });

    afterEach(() => {
      Subscription.destroy.restore();
    });

    it('should call Sequelize Model#destroy (public static) method', () => {
      // when
      const promise = subscriptionRepository.deleteById(123);

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

