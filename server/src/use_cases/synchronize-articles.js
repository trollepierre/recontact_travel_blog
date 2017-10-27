const FileReader = require('../infrastructure/external_services/file-reader');
const DropboxClient = require('../infrastructure/external_services/dropbox-client');
const { isEmpty } = require('lodash');
// const mailService = require('./mail-service');
const articleRepository = require('../domain/repositories/article-repository');
const chapterRepository = require('../domain/repositories/chapter-repository');

function serializeArticles(metadatas) {
  return metadatas
    .map(metadata => ({
      dropboxId: metadata.name,
      imgPath: `/${metadata.name}/img0.jpg`,
    }));
}

function _compareDropboxAndDatabaseArticles(freshArticles) {
  return articleRepository.getAll()
    .then((oldArticles) => {
      const addedArticles = freshArticles.reduce((accumulatedArticles, freshArticle) => {
        const matchedArticles = oldArticles.filter(({ dropboxId }) => dropboxId === freshArticle.dropboxId);
        if (matchedArticles.length === 0) {
          accumulatedArticles.push(freshArticle);
        }
        return accumulatedArticles;
      }, []);
      const hasChanges = !isEmpty(addedArticles);
      return Promise.resolve({ addedArticles, hasChanges });
    });
}

function _transformToDownloadableLink(response) {
  return response.url.replace(/.$/, '1');
}

function _shareImg(article) {
  return DropboxClient.createSharedLink(article.imgPath)
    .then(imgLink => ({
      dropboxId: article.dropboxId,
      imgLink: _transformToDownloadableLink(imgLink),
    }));
}

function shareImages(articles) {
  const articlesWithAll = articles.reduce((promises, article) => {
    const articleWithAll = _shareImg(article);
    promises.push(articleWithAll);
    return promises;
  }, []);
  return Promise.all(articlesWithAll);
}

function _updateArticleInDatabase(report) {
  const { addedArticles } = report;
  return shareImages(addedArticles) // todo prepare une validation d'image si manquante
    .then(articles => articleRepository.create(articles))
    .then(() => Promise.resolve(report)); // todo use a do()
}

function _ifArticlesChangesThenUpdateArticlesInDatabase(report) {
  const result = report; // todo : remove one var here
  if (result.hasChanges) {
    return _updateArticleInDatabase(report);
  }
  return Promise.resolve(result);
}

function serializeChapters(rawArticle) {
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


function _shareOneImg(imgLink, articleId) {
  return DropboxClient.createSharedLink(`/${articleId}/${imgLink}`)
    .then(_transformToDownloadableLink);
}

function shareChapterImages(chapters, idArticle) {
  const chaptersWithSharableLink = chapters.chapters.reduce((promises, chapter) => {
    const promise = _shareOneImg(chapter.imgLink, idArticle);
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

function _getCompleteChaptersToShare(article) {
  const articleId = article.dropboxId;
  return DropboxClient.getTextFileStream(articleId) // todo understand why some articles (like 57) cannot be found by Dropbox
    .then(FileReader.read)
    .then(chaptersContent => serializeChapters(chaptersContent))
    .then(chapters => shareChapterImages(chapters, articleId))
    .then(chapters => chapters.chapters.map(chapter => Object.assign(chapter, { dropboxId: article.dropboxId }))); // todo : add to former method
}

function _updateChapterInDatabase({ addedArticles }) {
  const allChaptersToSave = addedArticles.reduce((promises, article) => {
    const chaptersOfThisArticleToSave = _getCompleteChaptersToShare(article);
    promises.push(chaptersOfThisArticleToSave);
    return promises;
  }, []);
  return Promise.all(allChaptersToSave)
    .then(chapters => chapterRepository.createArticleChapters(chapters[0])); // todo : delete former rows of this article
}

function _ifArticlesChangesThenUpdateChaptersInDatabase(report) {
  const result = report;
  if (result.hasChanges) {
    return _updateChapterInDatabase(report);
  }
  return Promise.resolve(result);
}

// function _ifArticlesChangedThenSendEmailToRecipients(report) {
//   const result = report;
//   if (result.hasChanges) {
//     return mailService.sendJobsChangedEmail(result);
//   }
//   return Promise.resolve(result);
// }

function synchronizeArticles() {
  return DropboxClient.getAllDropboxFoldersMetadatas()
    .then(serializeArticles)
    .then(fetchedArticles => _compareDropboxAndDatabaseArticles(fetchedArticles))
    .then(_ifArticlesChangesThenUpdateArticlesInDatabase)
    .then(_ifArticlesChangesThenUpdateChaptersInDatabase);
  // 2.B.4 j'envoie un mail aux abonnés
  // .then(_ifArticlesChangedThenSendEmailToRecipients);
}

// todo test all and extract methods

module.exports = {
  synchronizeArticles,
};
