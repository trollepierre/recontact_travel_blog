const config = require('../config/index');
const Dropbox = require('dropbox');

const DropboxApi = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllFileMetaDataInDropbox() {
    return DropboxApi.filesListFolder({ path: '', recursive: true })
      .then(response => response.entries);
  },

  shareImages(articles) {
    const articlesWithAll = articles.reduce((promises, article) => {
      const articleWithAll = this._shareImg(article);
      promises.push(articleWithAll);
      return promises;
    }, []);
    return Promise.all(articlesWithAll);
  },

  getFileContentStream(id) {
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.php` })
      .then(result => result.link);
  },

  shareChapterImages(chapters, idArticle) {
    const chaptersWithSharableLink = chapters.chapters.reduce((promises, chapter) => {
      const promise = DropboxClient._shareOneImg(chapter.imgLink, idArticle);
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
  },

  _shareImg(article) {
    return this._createSharedLink(article.imgPath)
      .then(imgLink => ({
        name: article.name,
        imgLink: this._transformToDownloadableLink(imgLink),
      }));
  },

  _shareOneImg(imgLink, articleId) {
    return this._createSharedLink(`/${articleId}/${imgLink}`)
      .then(this._transformToDownloadableLink);
  },

  _createSharedLink(path) {
    const options = { path, short_url: false };
    return DropboxApi.sharingCreateSharedLink(options);
  },

  _transformToDownloadableLink(response) {
    return response.url.replace(/.$/, '1');
  },
};

module.exports = DropboxClient;
