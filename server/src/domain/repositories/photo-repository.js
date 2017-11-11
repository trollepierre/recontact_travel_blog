const { Photo } = require('../models/index');
//
// function createArticleChapters(chapters) {
//   return Chapter
//     .bulkCreate(chapters);
// }

function getPhotosOfArticle(dropboxId) {
  return Photo.findAll({
    where: { dropboxId },
  });
}
//
// function deleteChaptersOfArticle(dropboxId) {
//   return Chapter.destroy({
//     where: { dropboxId },
//   });
// }

module.exports = {
  getPhotosOfArticle,
};
