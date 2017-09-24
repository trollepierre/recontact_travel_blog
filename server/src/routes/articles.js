const express = require('express');
const File = require('../infrastructure/file');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');
const ChaptersSerializer = require('../serializers/chapters');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getAllFileMetaDataInDropbox()
  .then(ArticlesSerializer.serialize)
  .then(articles => DropboxClient.shareImages(articles))
  .then(articlesDropbox => res.json(articlesDropbox)));

router.get('/:some_id', (req, res) => DropboxClient.getFileContentStream(req.params.some_id)
  .then(stream => File.read(stream))
  .then(chapterContent => ChaptersSerializer.serialize(chapterContent))
  .then((chapters) => {
    const chaptersWithSharableLink = chapters.chapters.reduce((promises, chapter) => {
      const promise = DropboxClient.shareOneImg(chapter.imgLink, req.params.some_id);
      promises.push(promise);
      return promises;
    }, []);
    return Promise.all(chaptersWithSharableLink)
      .then((imgLinks) => {
        const newChapters = chapters;
        for (let i = 0; i < imgLinks.length; i += 1) {
          newChapters.chapters[i].imgLink = imgLinks[i];
        }
        return newChapters;
      })
      .catch(error => Promise.reject(error));
  })
  .then(chapters => res.json(chapters)));

module.exports = router;
