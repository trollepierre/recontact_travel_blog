const subscriptionRepository = require('../domain/repositories/subscription-repository');

function getAllSubscriptions() {
  return subscriptionRepository.getAll();
}

module.exports = {
  getAllSubscriptions,
};
