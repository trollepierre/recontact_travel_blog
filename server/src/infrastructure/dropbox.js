const config = require('../config/index');
const Dropbox = require('dropbox');

const dbx = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllFileMetaDataInDropbox() {
    console.log('ici');

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
      .then((res) => {
        console.log('1. res.entries');
        console.log(res.entries);
        return res.entries;
      })
      .then(entries => entries.map((entry) => {
        console.log('2. entry');
        console.log(entry);

        return dbx.filesGetTemporaryLink({ path: entry.path_lower });
      }))
      .then((actions) => {
        console.log('3. actions');
        console.log(actions);
        return Promise.all(actions).catch(console.log);
      })
      .then(results => results.map(result => ({
        name: result.metadata.name,
        link: result.link
      })))
      .catch(console.log);
  },

  getFileContentStream(id) {
    console.log('in get');

    const pathDb = `/${id}/fr.php`;
    console.log(pathDb);

    return dbx.filesGetTemporaryLink({ path: pathDb })
      // .then((actions) => {
      //   console.log('3. actions');
      //   console.log(actions);
      //   return Promise.all(actions).catch(console.log);
      // })
      .then(result => result.link)
      // .then(resultLink => console.log('resultLink :', resultLink))
      .catch(console.log)
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
};

module.exports = DropboxClient;
