import { expect, sinon } from '../test-helper'
import DeleteSubscription from '../../src/use_cases/delete-subscription'
import SubscriptionRepository from '../../src/domain/repositories/subscription-repository'

describe('Unit | DeleteSubscription | deleteSubscription', () => {
  beforeEach(() => {
    sinon.stub(SubscriptionRepository, 'deleteById').resolves({})
  })

  afterEach(() => {
    SubscriptionRepository.deleteById.restore()
  })

  it('should call SubscriptionRepository to deleteById and to return', () => {
    // when
    const promise = DeleteSubscription.deleteSubscription()

    // then
    expect(SubscriptionRepository.deleteById).to.have.been.calledWith()
    return promise.then(returnedSubscriptions => {
      expect(returnedSubscriptions).to.deep.equal({})
    })
  })
})

