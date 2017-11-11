const chapterRepository = require('../domain/repositories/chapter-repository');
const articleRepository = require('../domain/repositories/article-repository');
const { isEmpty, flatten } = require('lodash');
const DropboxClient = require('../infrastructure/external_services/dropbox-client');
const FileReader = require('../infrastructure/external_services/file-reader');

function sync(dropboxId) {
  function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
    return _createArticlesInDatabase(report)
      .then(() => _insertArticlesContentsInDatabase(report))
      .then(() => Promise.resolve(report));
  }

  function _createArticlesInDatabase(report) {
    const { addedArticles } = report;
    return _shareImagesZeros(addedArticles)
      .then(articles => articleRepository.create(articles));
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

  function _insertArticlesContentsInDatabase({ addedArticles }) {
    const allChaptersToSave = addedArticles.reduce((promises, article) => {
      const chaptersOfThisArticleToSave = _updateTitleAndExtractChaptersFromArticleContent(article);
      promises.push(chaptersOfThisArticleToSave);
      return promises;
    }, []);
    return Promise.all(allChaptersToSave)
      .then(allChapters => flatten(allChapters))
      .then(chapters => chapterRepository.createArticleChapters(chapters));
  }

  function _updateTitleAndExtractChaptersFromArticleContent() {
    return DropboxClient.getTextFileStream(dropboxId)
      .then(FileReader.read)
      .then(articleContent => _serializeArticleContent(articleContent))
      .then(articleInfos => _updateArticleTitle(articleInfos))
      .then(articleInfos => _shareChapterImages(articleInfos, dropboxId))
      .then(articleInfos => articleInfos.chapters);
  }

  function _updateArticleTitle(articleInfos) {
    articleRepository.updateTitle(articleInfos.title, dropboxId);
    return articleInfos;
  }

  function _serializeArticleContent(rawArticle) {
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
        dropboxId,
        title: [title, subtitle].join(' ').trim(),
        imgLink,
        // TODO : add Paragraph from data in db -  text: this._addParagraphs(cuttedArticle[3 * i]),
        text: cuttedArticle[3 * i],
      };
    }
    return chapters;
  }

  function _shareChapterImages(articleInfos) {
    const chaptersWithSharableLink = articleInfos.chapters.reduce((promises, chapter) => {
      const promise = _shareChapterImage(chapter.imgLink);
      promises.push(promise);
      return promises;
    }, []);
    return Promise.all(chaptersWithSharableLink)
      .then((imgLinks) => {
        const newArticleInfos = articleInfos;
        for (let i = 0; i < imgLinks.length; i += 1) {
          newArticleInfos.chapters[i].imgLink = imgLinks[i];
        }
        return newArticleInfos;
      });
  }

  function _shareChapterImage(imgLink) {
    return DropboxClient.createSharedLink(`/${dropboxId}/${imgLink}`)
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
