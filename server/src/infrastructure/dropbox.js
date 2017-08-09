const config = require('../config/index');
const Dropbox = require('dropbox');

const dbx = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllFileMetaDataInDropbox() {
    return dbx.filesListFolder({ path: '', recursive: true })
      .then(response => Promise.resolve(response.entries))
      .catch(error => Promise.reject(error));
  },
};

module.exports = DropboxClient;
