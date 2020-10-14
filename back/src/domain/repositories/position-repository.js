import { Newposition } from '../models/index'

function getAll() {
  return Newposition.findAll()
}

function create(position) {
  return Newposition.create(position)
}

export default {
  getAll,
  create,
}
