const config = require('../config/index');
const Dropbox = require('dropbox');

const DropboxApi = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllDropboxFoldersMetadatas() {
    return DropboxApi.filesListFolder({ path: '', recursive: true })
      .then(response => response.entries.filter(metadata => metadata['.tag'] === 'folder'));
  },

  getTextFileStream(id) {
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.php` })
      .then(result => result.link);
  },

  createSharedLink(path) {
    const options = { path, short_url: false };
    return DropboxApi.sharingCreateSharedLink(options);
  },

};

module.exports = DropboxClient;
