import isEmpty from 'lodash/isEmpty'

// Dropbox hands out /scl/fi/ links now; the legacy /s/ ones survive on files
// shared years ago, so both formats coexist. `raw=1` serves the file directly in
// both cases, where the old `/s/raw/<key>` rewrite only ever worked on the
// legacy form — on a /scl/fi/ link it read undefined and threw, taking the
// process down mid-synchronisation.
const toRawImgLink = response => {
  if (isEmpty(response) || !response.url) {
    return ''
  }

  const [withoutQuery, query = ''] = response.url.split('?')
  const params = query.split('&').filter(param => param && !param.startsWith('dl='))
  params.push('raw=1')
  return `${withoutQuery}?${params.join('&')}`
}

export {
  toRawImgLink,
}
