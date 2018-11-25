const { expect, sinon } = require('../test-helper')
const GetAllSubscriptions = require('../../src/use_cases/get-all-subscriptions')
const SubscriptionRepository = require('../../src/domain/repositories/subscription-repository')

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
    return promise.then((returnedSubscriptions) => {
      expect(returnedSubscriptions).to.deep.equal(subscriptions)
    })
  })
})

