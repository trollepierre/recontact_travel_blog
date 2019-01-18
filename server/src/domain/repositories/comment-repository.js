import { Comment } from '../models/index'

function getAllById(dropboxId) {
  return Comment.findAll({
    where: { dropboxId },
  })
}

function getCreatedComment({ text, author }) {
  return Comment.findOne({ where: { text, author } })
}

async function create(comment) {
  await Comment.create(comment)
  return getCreatedComment(comment)
}

export default {
  getAllById,
  create,
}
