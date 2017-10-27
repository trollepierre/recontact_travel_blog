const { Subscription } = require('../../infrastructure/db/index');

function addSubscription(subscriberEmail) {
  return Subscription
    .findOrCreate({ where: { email: subscriberEmail } })
    .spread((subscription, created) => ({ subscription, created }));
}

function removeSubscription(subscriptionId) {
  return Subscription.destroy({ where: { id: subscriptionId } });
}

module.exports = {
  addSubscription,
  removeSubscription,
};
