import { Position } from '../models/index'

function getAll() {
  return Position.all()
}

function create(position) {
  return Position.create(position)
}

module.exports = {
  getAll,
  create,
}
