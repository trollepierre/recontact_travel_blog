const config = require('../config/index');
const Dropbox = require('dropbox');

const dbx = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllFileMetaDataInDropbox() {
    return dbx.filesListFolder({ path: '', recursive: true })
      .then(response => response.entries)
      .catch(error => Promise.reject(error));
  },

  shareImages(articles) {
    const articlesWithAll = articles.reduce((promises, article) => {
      const articleWithAll = this._shareImg(article);
      promises.push(articleWithAll);
      return promises;
    }, []);
    return Promise.all(articlesWithAll)
      .catch(error => Promise.reject(error));
  },

  getFromWeb(id) {
    return dbx.filesListFolder({ path: `/${id}` })
      .then(res => res.entries
        .map(entry => dbx.filesGetTemporaryLink({ path: entry.path_lower })))
      .then(actions => Promise.all(actions).catch(console.log))
      .then(results => results.map(result => ({
        name: result.metadata.name,
        link: result.link,
      })))
      .catch(console.log);
  },

  getFileContentStream(id) {
    const pathDb = `/${id}/fr.php`;
    return dbx.filesGetTemporaryLink({ path: pathDb })
      .then(result => result.link)
      .catch(error => Promise.reject(error));
  },

  _getImgLinkFrom(response) {
    return response.url.replace(/.$/, '1');
  },

  _shareImg(article) {
    const options = { path: article.imgLink, short_url: false };
    return dbx.sharingCreateSharedLink(options)
      .then(response => ({
        name: article.name,
        imgLink: this._getImgLinkFrom(response),
      }))
      .catch(error => Promise.reject(error));
  },

  shareOneImg(imgLink, articleId) {
    const options = { path: `/${articleId}/${imgLink}`, short_url: false };
    return dbx.sharingCreateSharedLink(options)
      .then(this._getImgLinkFrom)
      .catch(error => Promise.reject(error));
  },
};

module.exports = DropboxClient;
