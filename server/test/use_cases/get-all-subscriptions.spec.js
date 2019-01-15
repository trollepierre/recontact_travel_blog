import { expect, sinon } from '../test-helper'
import GetAllSubscriptions from '../../src/use_cases/get-all-subscriptions'
import SubscriptionRepository from '../../src/domain/repositories/subscription-repository'

describe('Unit | GetAllSubscriptions | getAllSubscriptions', () => {
  const subscriptions = [{ email: 'pierre@recontact.me' }]

  beforeEach(() => {
    sinon.stub(SubscriptionRepository, 'getAll').resolves(subscriptions)
  })

  afterEach(() => {
    SubscriptionRepository.getAll.restore()
  })

  it('should call SubscriptionRepository to getAll subscriptions to return', () => {
    // when
    const promise = GetAllSubscriptions.getAllSubscriptions()

    // then
    expect(SubscriptionRepository.getAll).to.have.been.calledWith()
    return promise.then(returnedSubscriptions => {
      expect(returnedSubscriptions).to.deep.equal(subscriptions)
    })
  })
})

