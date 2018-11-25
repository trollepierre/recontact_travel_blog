import articleRepository from '../domain/repositories/article-repository'

function getAllArticles() {
  return articleRepository.getAll()
}

module.exports = {
  getAllArticles,
}
