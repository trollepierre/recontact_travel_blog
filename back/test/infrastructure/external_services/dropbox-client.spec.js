import dropboxFilesListFolder from '../../fixtures/dropboxFilesListFolder'
import filteredDropboxPaths from '../../fixtures/filteredDropboxPaths'
import dropboxFilesGetTemporaryLink from '../../fixtures/dropboxFilesGetTemporaryLink'
import dropboxSharedLinkCreate from '../../fixtures/dropboxSharedLinkCreate'
import DropboxClient, { dropboxApi } from '../../../src/infrastructure/external_services/dropbox-client'
import { expect, sinon } from '../../test-helper'

// createSharedLink waits 1s before retrying, so those specs need more than the 2s default
const RETRY_TIMEOUT = 5000

// The Dropbox SDK v10 wraps every answer in { status, headers, result }
const dropboxResponse = result => ({ status: 200, headers: {}, result })

const alreadySharedError = () => {
  const err = new Error('Dropbox error')
  err.error = { error_summary: 'shared_link_already_exists/...', error: { '.tag': 'shared_link_already_exists' } }
  return err
}

describe('Unit | Infrastructure | dropbox-client', () => {
  describe('#getAllDropboxFoldersMetadatas', () => {
    beforeEach(() => {
      sinon.stub(dropboxApi, 'filesListFolder')
      sinon.stub(dropboxApi, 'filesListFolderContinue')
    })

    afterEach(() => {
      dropboxApi.filesListFolder.restore()
      dropboxApi.filesListFolderContinue.restore()
    })

    describe('with a successful answer', () => {
      it('should return filtered file metadatas from dropbox', () => {
        // given
        dropboxApi.filesListFolder.resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))

        // when
        const promise = DropboxClient.getAllDropboxFoldersMetadatas()

        // then
        return promise.then(entries => {
          expect(entries).to.deep.equal(dropboxFilesListFolder())
        })
      })

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        dropboxApi.filesListFolder.resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))

        // when
        DropboxClient.getAllDropboxFoldersMetadatas()

        // then
        expect(dropboxApi.filesListFolder).to.have.been.calledWith({ path: '', recursive: true })
      })

      describe('when FilesListFolder.has_more is false', () => {
        it('should not call dropbox API "filesListFolderContinue" ', () => {
          // given
          dropboxApi.filesListFolder.resolves(dropboxResponse({
            has_more: false,
            cursor: 'cursor',
            entries: dropboxFilesListFolder(),
          }))
          dropboxApi.filesListFolderContinue.resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))

          // when
          const promise = DropboxClient.getAllDropboxFoldersMetadatas()

          // then
          return promise.then(() => {
            expect(dropboxApi.filesListFolderContinue).not.to.have.been.called
          })
        })
      })

      describe('when FilesListFolder.has_more is true', () => {
        it('should call dropbox API "filesListFolderContinue" with former cursor', () => {
          // given
          dropboxApi.filesListFolder.resolves(dropboxResponse({
            has_more: true,
            cursor: 'cursor',
            entries: dropboxFilesListFolder(),
          }))
          dropboxApi.filesListFolderContinue.resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))

          // when
          const promise = DropboxClient.getAllDropboxFoldersMetadatas()

          // then
          return promise.then(() => {
            expect(dropboxApi.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor' })
          })
        })

        describe('when FilesListFolderContinue.has_more is true twice', () => {
          beforeEach(() => {
            // given
            dropboxApi.filesListFolder.resolves(dropboxResponse({
              has_more: true,
              cursor: 'cursor',
              entries: dropboxFilesListFolder(),
            }))
            const stub = dropboxApi.filesListFolderContinue
            stub.onFirstCall()
              .resolves(dropboxResponse({
                has_more: true,
                cursor: 'cursor2',
                entries: dropboxFilesListFolder(),
              }))
            stub.onSecondCall()
              .resolves(dropboxResponse({
                has_more: true,
                cursor: 'cursor3',
                entries: dropboxFilesListFolder(),
              }))
            stub.onThirdCall().resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))
          })

          it('should call again  2 more times dropbox API "filesListFolderContinue" with former cursors', () => {
            // when
            const promise = DropboxClient.getAllDropboxFoldersMetadatas()

            // then
            return promise.then(() => {
              expect(dropboxApi.filesListFolderContinue).to.have.been.calledThrice
              expect(dropboxApi.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor' })
              expect(dropboxApi.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor2' })
              expect(dropboxApi.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor3' })
            })
          })

          it('should return the response of the four dropbox answer as entries', () => {
            // when
            const promise = DropboxClient.getAllDropboxFoldersMetadatas()

            // then
            return promise.then(entries => {
              expect(entries.length).to.equal(dropboxFilesListFolder().length * 4)
            })
          })
        })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        dropboxApi.filesListFolder.rejects(new Error('Expected error'))

        // when
        const promise = DropboxClient.getAllDropboxFoldersMetadatas()

        // then
        return promise.then(() => {
          throw new Error()
        }, err => {
          expect(err.message).to.equal('Expected error')
        })
      })
    })
  })

  describe('#getFilesFolderPaths()', () => {
    const idArticle = 59

    beforeEach(() => {
      sinon.stub(dropboxApi, 'filesListFolder')
    })

    afterEach(() => {
      dropboxApi.filesListFolder.restore()
    })

    describe('with a successful answer', () => {
      it('should return filtered file metadatas from dropbox', () => {
        // given
        dropboxApi.filesListFolder.resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))

        // when
        const promise = DropboxClient.getFilesFolderPaths(idArticle)

        // then
        return promise.then(entries => {
          expect(entries).to.deep.equal(filteredDropboxPaths)
        })
      })

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        dropboxApi.filesListFolder.resolves(dropboxResponse({ entries: dropboxFilesListFolder() }))

        // when
        DropboxClient.getFilesFolderPaths(idArticle)

        // then
        expect(dropboxApi.filesListFolder).to.have.been.calledWith({ path: '/59/', recursive: true })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        dropboxApi.filesListFolder.rejects(new Error('Expected error'))

        // when
        const promise = DropboxClient.getFilesFolderPaths(idArticle)

        // then
        return promise.then(() => {
          throw new Error()
        }, err => {
          expect(err.message).to.equal('Expected error')
        })
      })
    })
  })

  describe('#getFrTextFileStream', () => {
    let idArticle

    beforeEach(() => {
      sinon.stub(dropboxApi, 'filesGetTemporaryLink')
      idArticle = 59
    })

    afterEach(() => {
      dropboxApi.filesGetTemporaryLink.restore()
    })

    describe('with a successful answer', () => {
      it('should return link from dropbox answer', () => {
        // given
        dropboxApi.filesGetTemporaryLink.resolves(dropboxResponse(dropboxFilesGetTemporaryLink()))

        // when
        const promise = DropboxClient.getFrTextFileStream(idArticle)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink().link)
        })
      })

      it('should call dropbox API "dropbox filesGetTemporaryLink" with path container idArticle', () => {
        // given
        dropboxApi.filesGetTemporaryLink.resolves(dropboxResponse(dropboxFilesGetTemporaryLink()))

        // when
        DropboxClient.getFrTextFileStream(idArticle)

        // then
        expect(dropboxApi.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/fr.php` })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        dropboxApi.filesGetTemporaryLink.rejects(new Error('Expected error'))

        // when
        const promise = DropboxClient.getFrTextFileStream(idArticle)

        // then
        return promise.then(() => {
          throw new Error()
        }, err => {
          expect(err.message).to.equal('Expected error')
        })
      })
    })
  })

  describe('#getEnTextFileStream', () => {
    let idArticle

    beforeEach(() => {
      sinon.stub(dropboxApi, 'filesGetTemporaryLink')
      idArticle = 59
    })

    afterEach(() => {
      dropboxApi.filesGetTemporaryLink.restore()
    })

    describe('with a successful answer', () => {
      it('should return link from dropbox answer', () => {
        // given
        dropboxApi.filesGetTemporaryLink.resolves(dropboxResponse(dropboxFilesGetTemporaryLink()))

        // when
        const promise = DropboxClient.getEnTextFileStream(idArticle)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink().link)
        })
      })

      it('should call dropbox API "dropbox filesGetTemporaryLink" with path container idArticle', () => {
        // given
        dropboxApi.filesGetTemporaryLink.resolves(dropboxResponse(dropboxFilesGetTemporaryLink()))

        // when
        DropboxClient.getEnTextFileStream(idArticle)

        // then
        expect(dropboxApi.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/en.php` })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        dropboxApi.filesGetTemporaryLink.rejects(new Error('Expected error'))

        // when
        const promise = DropboxClient.getEnTextFileStream(idArticle)

        // then
        return promise.then(() => {
          throw new Error()
        }, err => {
          expect(err.message).to.equal('Expected error')
        })
      })
    })
  })

  describe('#createSharedLink', () => {
    let path
    let consoleErrorStub
    let consoleInfoStub

    beforeEach(() => {
      sinon.stub(dropboxApi, 'sharingCreateSharedLinkWithSettings')
      sinon.stub(dropboxApi, 'sharingListSharedLinks')
      consoleErrorStub = sinon.stub(console, 'error')
      consoleInfoStub = sinon.stub(console, 'info')
      path = '/60/fr.php'
    })

    afterEach(() => {
      dropboxApi.sharingCreateSharedLinkWithSettings.restore()
      dropboxApi.sharingListSharedLinks.restore()
      consoleErrorStub.restore()
      consoleInfoStub.restore()
    })

    describe('with a successful answer', () => {
      it('should return created link', () => {
        // given
        dropboxApi.sharingCreateSharedLinkWithSettings.resolves(dropboxResponse(dropboxSharedLinkCreate))

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal(dropboxSharedLinkCreate)
        })
      })

      it('should call dropbox API "sharingCreateSharedLinkWithSettings" with path', () => {
        // given
        dropboxApi.sharingCreateSharedLinkWithSettings.resolves(dropboxResponse(dropboxSharedLinkCreate))

        // when
        DropboxClient.createSharedLink(path)

        // then
        expect(dropboxApi.sharingCreateSharedLinkWithSettings).to.have.been.calledWith({ path })
      })
    })

    describe('when the file is already shared', () => {
      it('should return the existing shared link', () => {
        // given
        dropboxApi.sharingCreateSharedLinkWithSettings.rejects(alreadySharedError())
        dropboxApi.sharingListSharedLinks.resolves(dropboxResponse({ links: [dropboxSharedLinkCreate] }))

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        return promise.then(link => {
          expect(dropboxApi.sharingListSharedLinks).to.have.been.calledWith({ path, direct_only: true })
          expect(link).to.deep.equal(dropboxSharedLinkCreate)
        })
      })

      it('should return an empty link when dropbox lists none', () => {
        // given
        dropboxApi.sharingCreateSharedLinkWithSettings.rejects(alreadySharedError())
        dropboxApi.sharingListSharedLinks.resolves(dropboxResponse({ links: [] }))

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal({})
        })
      })
    })

    describe('with an error', () => {
      it('should retry once and return the link when the retry succeeds', function retrySucceeds() {
        this.timeout(RETRY_TIMEOUT)

        // given
        dropboxApi.sharingCreateSharedLinkWithSettings.onFirstCall().rejects(new Error('Expected error'))
        dropboxApi.sharingCreateSharedLinkWithSettings.onSecondCall()
          .resolves(dropboxResponse(dropboxSharedLinkCreate))

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        return promise.then(link => {
          expect(dropboxApi.sharingCreateSharedLinkWithSettings).to.have.been.calledTwice
          expect(link).to.deep.equal(dropboxSharedLinkCreate)
        })
      })

      it('should return an empty object when the retry fails too', function retryFails() {
        this.timeout(RETRY_TIMEOUT)

        // given
        dropboxApi.sharingCreateSharedLinkWithSettings.rejects(new Error('Expected error'))

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal({})
        })
      })
    })
  })
})
