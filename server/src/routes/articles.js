const express = require('express');
const File = require('../infrastructure/file');
const DropboxClient = require('../infrastructure/dropbox');
const ArticlesSerializer = require('../serializers/articles');
const ParagraphsSerializer = require('../serializers/paragraphs');

const router = express.Router();

router.get('/', (req, res) => DropboxClient.getAllFileMetaDataInDropbox()
  .then(ArticlesSerializer.serialize)
  .then(articles => DropboxClient.shareImages(articles))
  .then(articlesDropbox => res.json(articlesDropbox)));

router.get('/:some_id', (req, res) => DropboxClient.getFileContentStream(req.params.some_id)
  .then(stream => File.read(stream))
  .then(paragraphContent => ParagraphsSerializer.serialize(paragraphContent))
  .then((paragraphs) => {
    const paragraphsWithSharableLink = paragraphs.paragraphs.reduce((promises, paragraph) => {
      const promise = DropboxClient.shareOneImg(paragraph.imgLink, req.params.some_id);
      promises.push(promise);
      return promises;
    }, []);
    return Promise.all(paragraphsWithSharableLink)
      .then((imgLinks) => {
        const newParagraphs = paragraphs;
        for (let i = 0; i < imgLinks.length; i += 1) {
          newParagraphs.paragraphs[i].imgLink = imgLinks[i];
        }
        return newParagraphs;
      })
      .catch(error => Promise.reject(error));
  })
  .then(paragraphs => res.json(paragraphs)));

module.exports = router;
