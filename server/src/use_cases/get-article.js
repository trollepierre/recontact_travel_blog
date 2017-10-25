const chapterRepository = require('../domain/repositories/chapter-repository');

function _getChaptersOfArticle(dropboxId) {
  return chapterRepository.getChaptersOfArticle(dropboxId);
}

function _addParagraphsInOneText(text) {
  return text.split('#').map(row => row.trim());
}

function _addParagraphsInAllChapters(chapters) {
  return chapters.map(chapter => Object.assign(chapter, { text: _addParagraphsInOneText(chapter.text) }));
}

function getAllChapters(dropboxId) {
  return _getChaptersOfArticle(dropboxId)
    .then(chapters => _addParagraphsInAllChapters(chapters));
}

module.exports = {
  getAllChapters,
};
