const articleRepository = require('../domain/repositories/article-repository')

function deleteArticle(id) {
  return articleRepository.deleteArticle(id)
}

module.exports = {
  deleteArticle,
}
