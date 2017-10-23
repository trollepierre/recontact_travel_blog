const chapterService = require('../domain/database_services/chapter-service');

function _getChaptersOfArticle(dropboxId) {
  return chapterService.getChaptersOfArticle(dropboxId);
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
