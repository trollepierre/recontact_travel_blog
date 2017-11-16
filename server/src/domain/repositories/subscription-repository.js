const { Subscription } = require('../models/index');

function getByEmail(subscriberEmail) {
  return Subscription.findOne({ where: { email: subscriberEmail } });
}

function create(subscriberEmail) {
  return Subscription.create({ email: subscriberEmail });
}

function deleteById(subscriptionId) {
  return Subscription.destroy({ where: { id: subscriptionId } });
}

function getAll() {
  return Subscription.all();
}

module.exports = {
  deleteById,
  getAll,
  getByEmail,
  create,
};
