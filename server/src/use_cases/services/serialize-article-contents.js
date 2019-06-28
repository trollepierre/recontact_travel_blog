function buildFullTitle(title, subtitle) {
  if ((title && subtitle) || (!title && !subtitle)) {
    return [title, subtitle].join(' - ').trim()
  }
  return [title, subtitle].join('')
}

function _generateChapters(cuttedArticles, dropboxId, dropboxFiles) {
  const chapterImagesPath = dropboxFiles.map(img => img.path_display)
  const frenchArticle = cuttedArticles[0]
  const englishArticle = cuttedArticles[1]
  const chapters = []
  for (let i = 1; i < frenchArticle.length / 3; i += 1) {
    const imgLink = chapterImagesPath.filter(imgPath => imgPath.match(`/${dropboxId}/[iI]mg-?${i}.jpg$`))[0]
    const frenchTitle = frenchArticle[(3 * i) - 2]
    const frenchSubtitle = frenchArticle[(3 * i) - 1]
    const englishTitle = englishArticle[(3 * i) - 2]
    const englishSubtitle = englishArticle[(3 * i) - 1]
    const frTitle = buildFullTitle(frenchTitle, frenchSubtitle)
    const enTitle = buildFullTitle(englishTitle, englishSubtitle)
    chapters[i - 1] = {
      position: i,
      dropboxId,
      frTitle,
      enTitle,
      imgLink,
      frText: frenchArticle[3 * i],
      enText: englishArticle[3 * i],
    }
  }
  return chapters
}

export function _serializeArticleContents(rawArticles, dropboxId, dropboxFiles) {
  const cuttedArticles = rawArticles.map(rawArticle => rawArticle
    .split('*')
    .map(row => row.trim()))

  const chapters = _generateChapters(cuttedArticles, dropboxId, dropboxFiles)

  return {
    frTitle: cuttedArticles[0][0],
    enTitle: cuttedArticles[1][0],
    chapters,
    dropboxId,
  }
}
