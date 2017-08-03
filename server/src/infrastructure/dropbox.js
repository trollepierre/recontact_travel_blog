const config = require('../config/index');
const Dropbox = require('dropbox');

const dbx = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getFile() {
    return dbx.filesListFolder({ path: '' })
      .then((response) => {
        return `https://www.dropbox.com/home/Applications/Recontact%20Travel%20Blog?preview=${response.entries[0].name}`;
      })
      .catch(error => error);
  },
};

module.exports = DropboxClient;
