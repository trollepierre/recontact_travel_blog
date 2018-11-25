const { expect, sinon } = require('../test-helper')
const DeleteSubscription = require('../../src/use_cases/delete-subscription')
const SubscriptionRepository = require('../../src/domain/repositories/subscription-repository')

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
    return promise.then((returnedSubscriptions) => {
      expect(returnedSubscriptions).to.deep.equal({})
    })
  })
})

