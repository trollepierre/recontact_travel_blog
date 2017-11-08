const chapterRepository = require('../domain/repositories/chapter-repository');
const articleRepository = require('../domain/repositories/article-repository');
const { isEmpty, flatten } = require('lodash');
const DropboxClient = require('../infrastructure/external_services/dropbox-client');
const FileReader = require('../infrastructure/external_services/file-reader');

function sync(dropboxId) {
  function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
    const result = report; // todo : remove one var here
    return _updateArticleInDatabase(result)
      .then(() => _updateChaptersInDatabase(result))
      .then(() => Promise.resolve(result));
  }

  function _updateArticleInDatabase(report) {
    const { addedArticles } = report;
    return _shareImagesZeros(addedArticles) // todo prepare une validation d'image si manquante
      .then(articles => articleRepository.create(articles));
  }

  function _updateChaptersInDatabase({ addedArticles }) {
    const allChaptersToSave = addedArticles.reduce((promises, article) => {
      const chaptersOfThisArticleToSave = _getCompleteChaptersToShare(article);
      promises.push(chaptersOfThisArticleToSave);
      return promises;
    }, []);
    return Promise.all(allChaptersToSave)
      .then(allChapters => flatten(allChapters))
      .then(chapters => chapterRepository.createArticleChapters(chapters)); // todo : delete former rows of this article
  }

  function _getCompleteChaptersToShare(article) {
    const articleId = article.dropboxId;
    return DropboxClient.getTextFileStream(articleId) // todo understand why some articles (like 57) cannot be found by Dropbox
      .then(FileReader.read)
      .then(chaptersContent => _serializeChapters(chaptersContent))
      .then(chapters => _shareChapterImages(chapters, articleId))
      .then(chapters => chapters.chapters.map(chapter => Object.assign(chapter, { dropboxId: article.dropboxId }))); // todo : add to former method
  }

  function _shareImagesZeros(articles) {
    const articlesWithAll = articles.reduce((promises, article) => {
      const articleWithAll = _shareImageZero(article);
      promises.push(articleWithAll);
      return promises;
    }, []);
    return Promise.all(articlesWithAll);
  }

  function _shareImageZero(article) {
    return Promise.all([
      DropboxClient.createSharedLink(article.imgPath),
      DropboxClient.createSharedLink(article.galleryPath),
    ])
      .then(responses => ({
        dropboxId: article.dropboxId,
        imgLink: _transformToImgLink(responses[0]),
        galleryLink: _getGalleryUrl(responses[1]),
      }));
  }

  function _serializeChapters(rawArticle) {
    const cuttedArticle = rawArticle
      .split('*')
      .map(row => row.trim());

    const chapters = _generateChapters(cuttedArticle);

    return {
      title: cuttedArticle[0],
      chapters,
    };
  }

  function _generateChapters(cuttedArticle) {
    const chapters = [];
    for (let i = 1; i < cuttedArticle.length / 3; i += 1) {
      const imgLink = `img${i}.jpg`;
      const title = cuttedArticle[(3 * i) - 2];
      const subtitle = cuttedArticle[(3 * i) - 1];
      chapters[i - 1] = {
        title: [title, subtitle].join(' ').trim(),
        imgLink,
        // TODO : add Paragraph from data in db -  text: this._addParagraphs(cuttedArticle[3 * i]),
        text: cuttedArticle[3 * i],
      };
    }
    return chapters;
  }

  function _shareChapterImages(chapters, idArticle) {
    const chaptersWithSharableLink = chapters.chapters.reduce((promises, chapter) => {
      const promise = _shareChapterImage(chapter.imgLink, idArticle);
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
      });
  }

  function _shareChapterImage(imgLink, articleId) {
    return DropboxClient.createSharedLink(`/${articleId}/${imgLink}`)
      .then(_transformToImgLink);
  }

  function _transformToImgLink(response) {
    return isEmpty(response) ? '' : response.url.replace(/.$/, '1');
  }

  function _getGalleryUrl(response) {
    return isEmpty(response) ? '' : response.url;
  }


  const report = {
    addedArticles: [
      {
        dropboxId,
        imgPath: `/${dropboxId}/img0.jpg`,
        galleryPath: `/${dropboxId}`,
      },
    ],
  };
  return Promise.all([
    articleRepository.deleteArticle(dropboxId),
    chapterRepository.deleteChaptersOfArticle(dropboxId),
  ])
    .then(() => _ifArticlesChangesThenUpdateArticlesInDatabase(report));
}

module.exports = {
  sync,
};
