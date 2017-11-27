const subscriptionRepository = require('../domain/repositories/subscription-repository');
const { isEmpty } = require('lodash');

function subscribe(subscriptionForm) {
  console.log('in subscribe use case');
  return _findSubscription(subscriptionForm.email)
    .then((subscription) => {
      console.log('in ternary');
      console.log('!isEmpty(subscription)');
      console.log(!isEmpty(subscription));

      console.log('subscription');
      console.log(subscription);

      return (!isEmpty(subscription) ?
        { subscription, created: false } :
        _createSubscription(subscriptionForm)
          .then((createdSubscription) => {
            console.log('in last then');
            return ({ subscription: createdSubscription, created: true });
          }));
    });
}

function _findSubscription(userEmail) {
  console.log('in _findSubscription');
  return subscriptionRepository.getByEmail(userEmail);
}

function _createSubscription(subscription) {
  console.log('in _createSubscription');
  return subscriptionRepository.create(subscription);
}

module.exports = {
  subscribe,
};
