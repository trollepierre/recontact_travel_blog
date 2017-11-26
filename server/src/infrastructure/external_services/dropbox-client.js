const config = require('../config/index');
const Dropbox = require('dropbox');
const { flatten } = require('lodash');

const DropboxApi = new Dropbox({ accessToken: config.DROPBOX_CLIENT_ID });

const DropboxClient = {

  async getFilesListContinue(dropboxAnswer) {
    if (dropboxAnswer.has_more) {
      const filesListFolderContinue = await DropboxApi.filesListFolderContinue({ cursor: dropboxAnswer.cursor });
      return this.getFilesListContinue(
        {
          has_more: filesListFolderContinue.has_more,
          entries: flatten([dropboxAnswer.entries, filesListFolderContinue.entries]),
          cursor: filesListFolderContinue.cursor,
        });
    }
    return dropboxAnswer;
  },

  getAllDropboxFoldersMetadatas() {
    return DropboxApi.filesListFolder({ path: '', recursive: true })
      .then(dropboxAnswer => this.getFilesListContinue(dropboxAnswer))
      .then(response => response.entries)
      .catch((err) => {
        console.log('Erreur lors de la récupération de tous les fichiers Dropbox : ');
        console.log(err);
        throw err;
      });
  },

  getFilesFolderPaths(id) {
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
        console.log('err.error.code');
        console.log(err.error.code === 'ECONNRESET');

        if (err.error.code === 'ECONNRESET') {
          console.log('je tente une nouvelle fois');

          setTimeout(() => DropboxApi.sharingCreateSharedLink(options)
            .then((response) => {
              console.log('success');
              return response;
            })
            .catch((err2) => {
              if (err2.error.code === 'ECONNRESET') {
                console.log('Erreur ECONNRESET lors de la création du lien de : ', path);
                console.log('Dropbox TCP error ECNNRESET', err2);
                return Promise.resolve({});
              }
              console.log('Erreur étrange (ECONNRESET puis autre) lors de la création du lien de : ', path);
              console.log(err2);
              return Promise.resolve({});
            }), 1000);
        }
        console.log('Erreur lors de la création du lien de : ', path);
        console.log(err);
        return Promise.resolve({});
      });
  },

};

module.exports = DropboxClient;
