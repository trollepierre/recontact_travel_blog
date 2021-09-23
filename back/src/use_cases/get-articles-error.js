import GetArticlesMeta from './get-articles-meta'

const analyseArticleError = article => {
  // eslint-disable-next-line no-param-reassign
  article.error = []
  if (article.brokenImgDropboxId !== 0) {
    article.error.push('missing images of chapter')
  }
  if (article.photosCount === 0) {
    article.error.push('missing photos gallery')
  }
  if (article.chaptersCount === 0) {
    article.error.push('missing chapters')
  }
  return article
}

function getAll() {
  return GetArticlesMeta.getAll()
    .map(analyseArticleError)
    .filter(article => article.error.length !== 0)
}

export default {
  getAll,
}
