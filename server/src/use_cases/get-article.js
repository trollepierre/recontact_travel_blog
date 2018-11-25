import chapterRepository from '../domain/repositories/chapter-repository'
import articleRepository from '../domain/repositories/article-repository'

function _getChaptersOfArticle(dropboxId) {
  return chapterRepository.getChaptersOfArticle(dropboxId)
}

function _addParagraphsInOneText(text) {
  return text.split('#').map(row => row.trim())
}

function _addParagraphsInAllChapters(chapters) {
  return chapters.map(chapter => Object.assign(
    chapter,
    {
      frText: _addParagraphsInOneText(chapter.frText),
      enText: _addParagraphsInOneText(chapter.enText),
    },
  ))
}

function _addTitle(chapters, dropboxId) {
  return articleRepository.get(dropboxId)
    .then(({ frTitle, enTitle }) => ({ chapters, frTitle, enTitle }))
}

function getArticle(dropboxId) {
  return _getChaptersOfArticle(dropboxId)
    .then(chapters => _addParagraphsInAllChapters(chapters))
    .then(chapters => _addTitle(chapters, dropboxId))
}

export {
  getArticle,
}
