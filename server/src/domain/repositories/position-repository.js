import { Position } from '../models/index'

function getAll() {
  return Position.all()
}

function create(position) {
  return Position.create(position)
}

export {
  getAll,
  create,
}
