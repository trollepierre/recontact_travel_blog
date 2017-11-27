const { Subscription } = require('../models/index');

function getByEmail(subscriberEmail) {
  return Subscription.findOne({ where: { email: subscriberEmail } });
}

function create(subscription) {
  return Subscription.create(subscription)
    .catch((err) => {
      console.log('y a des errors dans le create');
      console.error(err);
      return err;
    });
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
