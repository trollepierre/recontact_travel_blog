import subscriptionRepository from '../domain/repositories/subscription-repository'

function getAllSubscriptions() {
  return subscriptionRepository.getAll()
}

export default {
  getAllSubscriptions,
}
