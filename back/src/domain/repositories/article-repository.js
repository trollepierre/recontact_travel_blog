import { Article } from '../models/index'

function create(articles) {
  return Article.bulkCreate(articles)
}

function getAll() {
  return Article.findAll()
}

// function getAllUntil(limit) {
//   return Article.findAll({ limit, order: [ ['frTitle', 'DESC']] })
// }

function get(dropboxId) {
  return Article.findOne({ where: { dropboxId } })
}

function update(titleToUpdate, dropboxId) {
  return Article.update(titleToUpdate, { where: { dropboxId } })
}

function deleteByDropboxId(dropboxId) {
  return Article.destroy({ where: { dropboxId } })
}

function deleteAll() {
  return Article.destroy({ where: {} })
}

export default {
  create,
  getAll,
  // getAllUntil,
  get,
  deleteByDropboxId,
  update,
  deleteAll,
}
