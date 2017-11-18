const subscriptionRepository = require('../domain/repositories/subscription-repository');
const { isEmpty } = require('lodash');

function subscribe(userEmail) {
  return _findSubscription(userEmail)
    .then(subscription => (!isEmpty(subscription) ?
      { subscription, created: false } :
      _createSubscription(userEmail)
        .then(createdSubscription => ({ subscription: createdSubscription, created: true }))));
}

function _findSubscription(userEmail) {
  return subscriptionRepository.getByEmail(userEmail);
}

function _createSubscription(userEmail) {
  return subscriptionRepository.create(userEmail);
}

module.exports = {
  subscribe,
};
