const config = require('../../infrastructure/config/index');
const Dropbox = require('dropbox');

const DropboxApi = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  // todo keep it
  getAllFileMetaDataInDropbox() {
    return DropboxApi.filesListFolder({ path: '', recursive: true })
      .then(response => response.entries)
      .then(metadatas => metadatas.filter(metadata => metadata['.tag'] === 'folder'));
  },

  // TODO remove it
  shareImages(articles) {
    const articlesWithAll = articles.reduce((promises, article) => {
      const articleWithAll = this._shareImg(article);
      promises.push(articleWithAll);
      return promises;
    }, []);
    return Promise.all(articlesWithAll);
  },

  // todo keep it
  getFileContentStream(id) {
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.php` })
      .then(result => result.link);
  },

  // todo remove it
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

  // todo remove it
  _shareImg(article) {
    return this._createSharedLink(article.imgPath)
      .then(imgLink => ({
        dropboxId: article.dropboxId,
        imgLink: this._transformToDownloadableLink(imgLink),
      }));
  },

  // todo remove it
  _shareOneImg(imgLink, articleId) {
    return this._createSharedLink(`/${articleId}/${imgLink}`)
      .then(this._transformToDownloadableLink);
  },

  // todo keep it
  _createSharedLink(path) {
    const options = { path, short_url: false };
    return DropboxApi.sharingCreateSharedLink(options);
  },

  // todo remove it
  _transformToDownloadableLink(response) {
    return response.url.replace(/.$/, '1');
  },
};

module.exports = DropboxClient;
