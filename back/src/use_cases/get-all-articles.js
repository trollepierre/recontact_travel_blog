import articleRepository from '../domain/repositories/article-repository'

const sortByDescendingNumberWithIntegerKey = (list, key) => list.sort((objectA, objectB) => {
  if (parseInt(objectA[key], 10) > parseInt(objectB[key], 10)) {
    return -1
  }
  if (parseInt(objectA[key], 10) < parseInt(objectB[key], 10)) {
    return 1
  }
  return 0
})

async function getAllArticles(limit) {
  if (limit === '0') {
    return articleRepository.getAll()
  }
  // better would be to use findAll order, but dropboxId is a string!!
  const allArticles = await articleRepository.getAll(limit)
  const selectLastUntil = sortByDescendingNumberWithIntegerKey(allArticles, 'dropboxId')
  console.log(selectLastUntil)

  return selectLastUntil.slice(0, limit)
}

export default {
  getAllArticles,
}
