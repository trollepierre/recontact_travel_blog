import { Comment } from '../models/index'
import { enhanceComment } from '../entities/comment-entity'

function getAll() {
  return Comment.findAll()
}

function getAllById(dropboxId) {
  return Comment.findAll({
    where: { dropboxId },
  })
    .then(comments => comments.map(enhanceComment))
}

function deleteById(id) {
  return Comment.destroy({ where: { id } })
}

function getCreatedComment({ text, author }) {
  return Comment.findOne({ where: { text, author } })
    .then(enhanceComment)
}

async function create(comment) {
  await Comment.create(comment)
  return getCreatedComment(comment)
}

export default {
  getAll,
  getAllById,
  create,
  deleteById,
}
