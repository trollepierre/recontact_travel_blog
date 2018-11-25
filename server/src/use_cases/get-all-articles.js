const articleRepository = require('../domain/repositories/article-repository')

function getAllArticles() {
  return articleRepository.getAll()
}

module.exports = {
  getAllArticles,
}
