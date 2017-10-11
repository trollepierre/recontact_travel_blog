const { Chapter } = require('../models');

function createChapters(chapters) {
  console.log('E. chapters');
  console.log(chapters);

  return Chapter
    .bulkCreate(chapters.chapters);
}

module.exports = {
  createChapters,
};
