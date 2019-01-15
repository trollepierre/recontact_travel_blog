import { expect, sinon } from '../test-helper'
import Subscribe from '../../src/use_cases/subscribe'
import SubscriptionRepository from '../../src/domain/repositories/subscription-repository'
import subscription from '../fixtures/savedSubscription'

describe('Unit | Subscribe | subscribe', () => {
  const email = 'pierre@recontact.me'
  const subscriptionForm = { email, lang: 'fr' }

  beforeEach(() => {
    sinon.stub(SubscriptionRepository, 'getByEmail')
    sinon.stub(SubscriptionRepository, 'create').resolves(subscription())
  })

  afterEach(() => {
    SubscriptionRepository.getByEmail.restore()
    SubscriptionRepository.create.restore()
  })

  it('should call SubscriptionRepository to getByEmail by userEmail', () => {
    // given
    SubscriptionRepository.getByEmail.resolves(null)

    // when
    Subscribe.subscribe(subscriptionForm)

    // then
    expect(SubscriptionRepository.getByEmail).to.have.been.calledWith(email)
  })

  describe('when email is already subscribed', () => {
    beforeEach(() => {
      SubscriptionRepository.getByEmail.resolves(subscription())
    })

    it('should not call SubscriptionRepository to create', () => {
      // when
      const promise = Subscribe.subscribe(subscriptionForm)

      // then
      return promise.then(() => {
        expect(SubscriptionRepository.create).not.to.have.been.called
      })
    })

    it('should call SubscriptionRepository to getByEmail subscriptions to return', () => {
      // when
      const promise = Subscribe.subscribe(subscriptionForm)

      // then
      return promise.then(returnedSubscriptions => {
        expect(returnedSubscriptions).to.deep.equal({ created: false, subscription: subscription() })
      })
    })
  })

  describe('when email is not already subscribed', () => {
    beforeEach(() => {
      SubscriptionRepository.getByEmail.resolves(null)
    })

    it('should call SubscriptionRepository to create by userEmail', () => {
      // when
      const promise = Subscribe.subscribe(subscriptionForm)

      // then
      return promise.then(() => {
        expect(SubscriptionRepository.create).to.have.been.calledWith(subscriptionForm)
      })
    })

    it('should call SubscriptionRepository to getByEmail subscriptions to return', () => {
      // when
      const promise = Subscribe.subscribe(subscriptionForm)

      // then
      return promise.then(returnedSubscriptions => {
        expect(returnedSubscriptions).to.deep.equal({ created: true, subscription: subscription() })
      })
    })
  })
})

