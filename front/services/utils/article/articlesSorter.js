const getDropboxId = article => parseInt(article.dropboxId, 10)

const sortByDropboxId = articles => articles.sort(
  (articleA, articleB) => getDropboxId(articleA) < getDropboxId(articleB) ? 1 : -1,
)

export {
  sortByDropboxId,
}
