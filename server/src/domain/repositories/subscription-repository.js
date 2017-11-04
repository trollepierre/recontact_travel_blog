const { Subscription } = require('../models/index');

function addSubscription(subscriberEmail) {
  return Subscription
    .findOrCreate({ where: { email: subscriberEmail } })
    .spread((subscription, created) => ({ subscription, created }));
}

function removeSubscription(subscriptionId) {
  return Subscription.destroy({ where: { id: subscriptionId } });
}

function getAll() {
  return Subscription
    .all();
}

module.exports = {
  addSubscription,
  removeSubscription,
  getAll,
};
