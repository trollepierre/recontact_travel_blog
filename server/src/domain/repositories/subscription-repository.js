import { Subscription } from '../models/index'

function getByEmail(subscriberEmail) {
  return Subscription.findOne({ where: { email: subscriberEmail } })
}

function create(subscription) {
  return Subscription.create(subscription)
}

function deleteById(subscriptionId) {
  return Subscription.destroy({ where: { id: subscriptionId } })
}

function getAll() {
  return Subscription.all()
}

export default {
  deleteById,
  getAll,
  getByEmail,
  create,
}
