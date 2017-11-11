const chapterRepository = require('../domain/repositories/chapter-repository');
const articleRepository = require('../domain/repositories/article-repository');

function _getChaptersOfArticle(dropboxId) {
  return chapterRepository.getChaptersOfArticle(dropboxId);
}

function _addParagraphsInOneText(text) {
  return text.split('#').map(row => row.trim());
}

function _addParagraphsInAllChapters(chapters) {
  return chapters.map(chapter => Object.assign(chapter, { text: _addParagraphsInOneText(chapter.text) }));
}

function _addTitle(chapters, dropboxId) {
  return articleRepository.get(dropboxId)
    .then(({ title }) => ({ chapters, title }));
}

function getArticle(dropboxId) {
  return _getChaptersOfArticle(dropboxId)
    .then(chapters => _addParagraphsInAllChapters(chapters))
    .then(chapters => _addTitle(chapters, dropboxId));
}

module.exports = {
  getArticle,
};
