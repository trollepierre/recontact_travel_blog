const subscriptionRepository = require('../domain/repositories/subscription-repository');
const { isEmpty } = require('lodash');

function subscribe(userEmail) {
  return findSubscription(userEmail)
    .then(subscription => (!isEmpty(subscription) ?
      { subscription, created: false } :
      createSubscription(userEmail)
        .then(createdSubscription => ({ subscription: createdSubscription, created: true }))));
}

function findSubscription(userEmail) {
  return subscriptionRepository.getByEmail(userEmail);
}

function createSubscription(userEmail) {
  return subscriptionRepository.create(userEmail);
}

module.exports = {
  subscribe,
};
