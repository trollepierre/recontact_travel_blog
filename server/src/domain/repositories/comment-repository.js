import { Comment } from '../models/index'

function getAll() {
  return Comment.all()
}

function getCreatedComment({ text, author }) {
  return Comment.findOne({ where: { text, author } })
}

async function create(comment) {
  await Comment.create(comment)
  return getCreatedComment(comment)
}

export default {
  getAll,
  create,
}
