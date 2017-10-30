const config = require('../config/index');
const Dropbox = require('dropbox');

const DropboxApi = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  getAllDropboxFoldersMetadatas() {
    return DropboxApi.filesListFolder({ path: '', recursive: true })
      .then(response => response.entries.filter(metadata => metadata['.tag'] === 'folder'))
      .catch((err) => {
        console.log('Erreur lors de la récupération de tous les fichiers Dropbox : ');
        console.log(err);
      });
  },

  getTextFileStream(id) {
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.php` })
      .then(result => result.link)
      .catch((err) => {
        console.log('Erreur lors de la récupération du fichier texte de : ', `/${id}/fr.php`);
        console.log(err);
      });
  },

  createSharedLink(path) {
    const options = { path, short_url: false };
    return DropboxApi.sharingCreateSharedLink(options)
      .catch((err) => {
        console.log('Erreur lors de la création du lien de : ', path);
        console.log(err);
      });
  },

};

module.exports = DropboxClient;
