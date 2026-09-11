import flatten from 'lodash/flatten'

import { Dropbox } from 'dropbox'
import env from '../env/env'

export const dropboxApi = new Dropbox({ accessToken: env('DROPBOX_CLIENT_ID') })

const RETRY_DELAY = 1000

const wait = delay => new Promise(resolve => {
  setTimeout(resolve, delay)
})

// sharingCreateSharedLinkWithSettings fails when the file is already shared,
// where the deprecated sharingCreateSharedLink used to return the existing link.
const isSharedLinkAlreadyExists = err => {
  const summary = err && err.error && err.error.error_summary
  return typeof summary === 'string' && summary.startsWith('shared_link_already_exists')
}

const createOrFetchSharedLink = async path => {
  try {
    const response = await dropboxApi.sharingCreateSharedLinkWithSettings({ path })
    return response.result
  } catch (err) {
    if (!isSharedLinkAlreadyExists(err)) {
      throw err
    }
    const response = await dropboxApi.sharingListSharedLinks({ path, direct_only: true })
    return response.result.links[0] || {}
  }
}

const DropboxClient = {

  async getFilesListContinue(dropboxAnswer) {
    if (dropboxAnswer.has_more) {
      const { result } = await dropboxApi.filesListFolderContinue({ cursor: dropboxAnswer.cursor })
      return this.getFilesListContinue({
        has_more: result.has_more,
        entries: flatten([dropboxAnswer.entries, result.entries]),
        cursor: result.cursor,
      })
    }
    return dropboxAnswer
  },

  getAllDropboxFoldersMetadatas() {
    return dropboxApi.filesListFolder({ path: '', recursive: true })
      .then(response => this.getFilesListContinue(response.result))
      .then(dropboxAnswer => dropboxAnswer.entries)
      .catch(err => {
        console.error('Erreur lors de la récupération de tous les fichiers Dropbox : ')
        console.error(err)
        throw err
      })
  },

  getFilesFolderPaths(id) {
    return dropboxApi.filesListFolder({ path: `/${id}/`, recursive: true })
      .then(response => response.result.entries.map(entry => entry.path_display))
      .catch(err => {
        console.error(`Erreur lors de la récupération de toutes les photos de l’article Dropbox : ${id}`)
        console.error(err)
        throw err
      })
  },

  getFrTextFileStream(id) {
    const extension = id < 64 ? 'php' : 'txt'
    return dropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.${extension}` })
      .then(response => response.result.link)
      .catch(err => {
        console.error('Erreur lors de la récupération du fichier texte de : ', `/${id}/fr.${extension}`)
        console.error(err)
        throw err
      })
  },

  getEnTextFileStream(id) {
    const extension = id < 64 ? 'php' : 'txt'
    return dropboxApi.filesGetTemporaryLink({ path: `/${id}/en.${extension}` })
      .then(response => response.result.link)
      .catch(err => {
        console.error('Erreur lors de la récupération du fichier texte de : ', `/${id}/en.${extension}`)
        console.error(err)
        throw err
      })
  },

  async createSharedLink(path) {
    try {
      return await createOrFetchSharedLink(path)
    } catch (err) {
      console.error('Erreur lors de la création du lien de : ', path)
      console.error(err)
      await wait(RETRY_DELAY)
      try {
        const link = await createOrFetchSharedLink(path)
        console.info('Erreur fixed after Timeout')
        return link
      } catch (err2) {
        console.error('Erreur encore : ', path)
        console.error(err2)
        return {}
      }
    }
  },

}

export default DropboxClient
