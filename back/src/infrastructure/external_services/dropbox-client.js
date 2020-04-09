import { flatten } from 'lodash';
import Dropbox from 'dropbox';
import env from '../env/env';

const DropboxApi = new Dropbox({ accessToken: env('DROPBOX_CLIENT_ID') });

const DropboxClient = {

  async getFilesListContinue(dropboxAnswer) {
    if (dropboxAnswer.has_more) {
      const filesListFolderContinue = await DropboxApi.filesListFolderContinue({ cursor: dropboxAnswer.cursor });
      return this.getFilesListContinue({
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
      .catch(err => {
        console.error('Erreur lors de la récupération de tous les fichiers Dropbox : ');
        console.error(err);
        throw err;
      });
  },

  getFilesFolderPaths(id) {
    return DropboxApi.filesListFolder({ path: `/${id}/`, recursive: true })
      .then(response => response.entries.map(entry => entry.path_display))
      .catch(err => {
        console.error(`Erreur lors de la récupération de toutes les photos de l’article Dropbox : ${id}`);
        console.error(err);
        throw err;
      });
  },

  getFrTextFileStream(id) {
    const extension = id < 64 ? 'php' : 'txt';
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.${extension}` })
      .then(result => result.link)
      .catch(err => {
        console.error('Erreur lors de la récupération du fichier texte de : ', `/${id}/fr.${extension}`);
        console.error(err);
        throw err;
      });
  },

  getEnTextFileStream(id) {
    const extension = id < 64 ? 'php' : 'txt';
    return DropboxApi.filesGetTemporaryLink({ path: `/${id}/en.${extension}` })
      .then(result => result.link)
      .catch(err => {
        console.error('Erreur lors de la récupération du fichier texte de : ', `/${id}/en.${extension}`);
        console.error(err);
        throw err;
      });
  },

  createSharedLink(path) {
    const options = { path, short_url: false };
    return DropboxApi.sharingCreateSharedLink(options)
      .catch(err => {
        if (err.error && err.error.code === 'ECONNRESET') {
          setTimeout(() => DropboxApi.sharingCreateSharedLink(options)
            .then(response => {
              console.info('Erreur ECONNRESET fixed after Timeout');
              return response;
            })
            .catch(err2 => {
              if (err2.error.code === 'ECONNRESET') {
                console.error('Erreur ECONNRESET lors de la création du lien de : ', path);
                console.error('Dropbox TCP error ECNNRESET', err2);
                return Promise.resolve({});
              }
              console.error('Erreur étrange (ECONNRESET puis autre) lors de la création du lien de : ', path);
              console.error(err2);
              return Promise.resolve({});
            }), 1000);
        }
        console.error('Erreur lors de la création du lien de : ', path);
        console.error(err);
        return Promise.resolve({});
      });
  },

  filesDownload(path) {
    // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html
    const arg = {
      path,
    };
    return DropboxApi.filesDownload(arg); // https://www.dropbox.com/developers/documentation/http/documentation#files-upload
  },

  filesUpload({path, file}) {
    const arg = {
      path,
      mode: {
        '.tag': 'update',
        update: 'a1c10ce0dd78',
      },
      autorename: false,
      mute: false,
      strict_conflict: false,
      contents: file,
    };
    // https://dropbox.github.io/dropbox-sdk-js/Dropbox.html
    return DropboxApi.filesUpload(arg)
      .then(function (response) {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      }); // https://www.dropbox.com/developers/documentation/http/documentation#files-upload
  },
};

module.exports = DropboxClient;
