const chapterRepository = require('../domain/repositories/chapter-repository');

function deleteArticle(dropboxId) {
  return chapterRepository.deleteChaptersOfArticle(dropboxId);
}

module.exports = {
  deleteArticle,
};
