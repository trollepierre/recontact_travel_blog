import UpdateArticle from './update-article'

function sanitizeLimits(limits) {
  const min = parseInt(limits.min, 10)
  const max = parseInt(limits.max, 10)
  return {
    min: min > 1 ? Math.round(min) : 1,
    max: max >= min ? Math.round(max) : 87,
  }
}

function sync(limits) {
  const { min, max } = sanitizeLimits(limits)
  const articlesToUpdate = []
  for (let dropboxId = min; dropboxId <= max; dropboxId++) { // eslint-disable-line no-plusplus
    const promise = () => UpdateArticle.sync(`${dropboxId}`)
    articlesToUpdate.push(promise())
  }
  return Promise.all(articlesToUpdate)
}

export default {
  sync,
}
