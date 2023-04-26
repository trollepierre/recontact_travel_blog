import { Newchapter } from '../models/index'
import { sortByAscendingNumber } from '../utils/ramda-utils'

function createArticleChapters(chapters) {
  return Newchapter
    .bulkCreate(chapters)
}

function getChaptersOfArticle(dropboxId) {
  return Newchapter.findAll({
    where: { dropboxId },
  })
    .then(chapters => sortByAscendingNumber(chapters, 'position'))
}

function deleteChaptersOfArticle(dropboxId) {
  return Newchapter.destroy({
    where: { dropboxId },
  })
}

function deleteChapterOfArticle(dropboxId, position) {
  return Newchapter.destroy({
    where: { dropboxId, position },
  })
}

function deleteAll() {
  return Newchapter.destroy({ where: {} })
}

function getAll() {
  return Newchapter.findAll()
}

function add(position) {
  return Newchapter.create(position)
}

export default {
  getAll,
  add,
  createArticleChapters,
  getChaptersOfArticle,
  deleteChaptersOfArticle,
  deleteChapterOfArticle,
  deleteAll,
}
