import flatten from 'lodash/flatten'

import { Dropbox } from 'dropbox'
import env from '../env/env'

export const dropboxApi = new Dropbox({ accessToken: env('DROPBOX_CLIENT_ID') })

const RETRY_DELAY = 1000

// A DropboxResponseError only says "Response failed with a 409 code"; what the
// call actually complained about sits in the error_summary of its body. Naming
// the route and the path turns an opaque status into something actionable in the
// http response, without a trip to the server logs.
// Rethrowing a plain Error also keeps dropbox's status from becoming our own:
// the express error handler reads err.status, and a 409 from dropbox means
// nothing to a client of this api.
const dropboxErrorSummary = err => {
  const body = err && err.error
  if (typeof body === 'string') {
    return body
  }
  if (body && typeof body.error_summary === 'string') {
    return body.error_summary
  }
  return (err && err.message) || 'unknown error'
}

const dropboxError = (call, err) => {
  const error = new Error(`Dropbox ${call} : ${dropboxErrorSummary(err)}`)
  error.cause = err
  console.error(error.message)
  console.error(err)
  return error
}

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
        throw dropboxError('filesListFolder /', err)
      })
  },

  getFilesFolderPaths(id) {
    return dropboxApi.filesListFolder({ path: `/${id}/`, recursive: true })
      .then(response => response.result.entries.map(entry => entry.path_display))
      .catch(err => {
        throw dropboxError(`filesListFolder /${id}/`, err)
      })
  },

  getFrTextFileStream(id) {
    const extension = id < 64 ? 'php' : 'txt'
    return dropboxApi.filesGetTemporaryLink({ path: `/${id}/fr.${extension}` })
      .then(response => response.result.link)
      .catch(err => {
        throw dropboxError(`filesGetTemporaryLink /${id}/fr.${extension}`, err)
      })
  },

  getEnTextFileStream(id) {
    const extension = id < 64 ? 'php' : 'txt'
    return dropboxApi.filesGetTemporaryLink({ path: `/${id}/en.${extension}` })
      .then(response => response.result.link)
      .catch(err => {
        throw dropboxError(`filesGetTemporaryLink /${id}/en.${extension}`, err)
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
