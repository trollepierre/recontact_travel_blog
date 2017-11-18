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
        throw err;
      });
  },

  getArticlePhotosPaths(id) {
    return DropboxApi.filesListFolder({ path: `/${id}/`, recursive: true })
      .then(response => response.entries.map(entry => entry.path_display))
      .catch((err) => {
        console.log(`Erreur lors de la récupération de toutes les photos de l‘article Dropbox : ${id}`);
        console.log(err);
        throw err;
      });
  },

  getFrTextFileStream(id) {
    const extension = (id < 64) ? 'php' : 'txt';
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.${extension}` })
      .then(result => result.link)
      .catch((err) => {
        console.log('Erreur lors de la récupération du fichier texte de : ', `/${id}/fr.${extension}`);
        console.log(err);
        throw err;
      });
  },

  getEnTextFileStream(id) {
    const extension = (id < 64) ? 'php' : 'txt';
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/en.${extension}` })
      .then(result => result.link)
      .catch((err) => {
        console.log('Erreur lors de la récupération du fichier texte de : ', `/${id}/en.${extension}`);
        console.log(err);
        throw err;
      });
  },

  createSharedLink(path) {
    const options = { path, short_url: false };
    return DropboxApi.sharingCreateSharedLink(options)
      .catch((err) => {
        console.log('Erreur lors de la création du lien de : ', path);
        console.log(err);
        return Promise.resolve({});
      });
  },

};

module.exports = DropboxClient;
