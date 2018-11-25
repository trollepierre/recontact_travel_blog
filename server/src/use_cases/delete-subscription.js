import subscriptionRepository from '../domain/repositories/subscription-repository'

function deleteSubscription(id) {
  return subscriptionRepository.deleteById(id)
}

export {
  deleteSubscription,
}
