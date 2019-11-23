import { Position } from '../models/index'

function getAll() {
  return Position.findAll()
}

function create(position) {
  return Position.create(position)
}

export default {
  getAll,
  create,
}
