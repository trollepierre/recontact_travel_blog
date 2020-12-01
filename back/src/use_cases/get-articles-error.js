import GetArticlesMeta from './get-articles-meta'

function getAll() {
  return GetArticlesMeta.getAll()
    .filter(article => article.photosCount === 0 || article.chaptersCount === 0)
}

export default {
  getAll,
}
