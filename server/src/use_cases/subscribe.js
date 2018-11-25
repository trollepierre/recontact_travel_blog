import { isEmpty } from 'lodash'
import subscriptionRepository from '../domain/repositories/subscription-repository'

function subscribe(subscriptionForm) {
  return _findSubscription(subscriptionForm.email)
    .then(subscription => (!isEmpty(subscription) ?
      { subscription, created: false } :
      _createSubscription(subscriptionForm)
        .then(createdSubscription => ({ subscription: createdSubscription, created: true }))))
}

function _findSubscription(userEmail) {
  return subscriptionRepository.getByEmail(userEmail)
}

function _createSubscription(subscription) {
  return subscriptionRepository.create(subscription)
}

export {
  subscribe,
}
