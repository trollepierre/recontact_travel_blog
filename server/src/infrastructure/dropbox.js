const config = require('../config/index');
const Dropbox = require('dropbox');

const dbx = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllFileMetaDataInDropbox() {
    return new Promise((resolve, reject) => {
      const options = { path: '', recursive: true };
      dbx.filesListFolder(options, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response.entries);
      });
    });
  },

  _shareImg(article) {
    return new Promise((resolve, reject) => {
      const options = { path: article.path, short_url: true };
      dbx.sharingCreateSharedLink(options, (err, response) => {
        if (err) {
          reject(err);
        }
        const articleWithAll = {
          name: article.name,
          imgLink: JSON.parse(response),
        };
        resolve(articleWithAll);
      });
    });
  },

  shareImages(articles) {
    console.log('1. shareImage');
    const articlesWithAll = articles.reduce((promises, article) => {
      console.log('2. ', article.imgLink);
      const articleWithAll = this._shareImg(article);
      console.log(articleWithAll);
      promises.push(articleWithAll);
      return promises;
    }, []);
    return Promise.all(articlesWithAll)
      .then(article => Promise.resolve(article));
  },
};

module.exports = DropboxClient;
