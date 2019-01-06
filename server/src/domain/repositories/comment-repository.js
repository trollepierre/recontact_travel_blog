import { Comment } from '../models/index'

function getAll() {
  return Comment.all()
}

function create(comment) {
  return Comment.create(comment)
}

export default {
  getAll,
  create,
}
