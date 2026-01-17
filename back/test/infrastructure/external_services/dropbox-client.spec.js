import Dropbox from 'dropbox'
import dropboxFilesListFolder from '../../fixtures/dropboxFilesListFolder'
import filteredDropboxPaths from '../../fixtures/filteredDropboxPaths'
import dropboxFilesGetTemporaryLink from '../../fixtures/dropboxFilesGetTemporaryLink'
import DropboxClient from '../../../src/infrastructure/external_services/dropbox-client'
import { expect, sinon } from '../../test-helper'

describe('Unit | Infrastructure | dropbox-client', () => {
  describe('#getAllDropboxFoldersMetadatas', () => {
    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesListFolder')
      sinon.stub(Dropbox.prototype, 'filesListFolderContinue')
    })

    afterEach(() => {
      Dropbox.prototype.filesListFolder.restore()
      Dropbox.prototype.filesListFolderContinue.restore()
    })

    describe('with a successful answer', () => {
      it('should return filtered file metadatas from dropbox', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() })

        // when
        const promise = DropboxClient.getAllDropboxFoldersMetadatas()

        // then
        return promise.then(entries => {
          expect(entries).to.deep.equal(dropboxFilesListFolder())
        })
      })

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() })

        // when
        DropboxClient.getAllDropboxFoldersMetadatas()

        // then
        expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith({ path: '', recursive: true })
      })

      describe('when FilesListFolder.has_more is false', () => {
        it('should not call dropbox API "filesListFolderContinue" ', () => {
          // given
          Dropbox.prototype.filesListFolder.resolves({
            has_more: false,
            cursor: 'cursor',
            entries: dropboxFilesListFolder(),
          })
          Dropbox.prototype.filesListFolderContinue.resolves({ entries: dropboxFilesListFolder() })

          // when
          const promise = DropboxClient.getAllDropboxFoldersMetadatas()

          // then
          return promise.then(() => {
            expect(Dropbox.prototype.filesListFolderContinue).not.to.have.been.called
          })
        })
      })

      describe('when FilesListFolder.has_more is true', () => {
        it('should call dropbox API "filesListFolderContinue" with former cursor', () => {
          // given
          Dropbox.prototype.filesListFolder.resolves({
            has_more: true,
            cursor: 'cursor',
            entries: dropboxFilesListFolder(),
          })
          Dropbox.prototype.filesListFolderContinue.resolves({ entries: dropboxFilesListFolder() })

          // when
          const promise = DropboxClient.getAllDropboxFoldersMetadatas()

          // then
          return promise.then(() => {
            expect(Dropbox.prototype.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor' })
          })
        })

        describe('when FilesListFolderContinue.has_more is true twice', () => {
          beforeEach(() => {
            // given
            Dropbox.prototype.filesListFolder.resolves({
              has_more: true,
              cursor: 'cursor',
              entries: dropboxFilesListFolder(),
            })
            const stub = Dropbox.prototype.filesListFolderContinue
            stub.onFirstCall()
              .resolves({
                has_more: true,
                cursor: 'cursor2',
                entries: dropboxFilesListFolder(),
              })
            stub.onSecondCall()
              .resolves({
                has_more: true,
                cursor: 'cursor3',
                entries: dropboxFilesListFolder(),
              })
            stub.onThirdCall().resolves({ entries: dropboxFilesListFolder() })
          })

          it('should call again  2 more times dropbox API "filesListFolderContinue" with former cursors', () => {
            // when
            const promise = DropboxClient.getAllDropboxFoldersMetadatas()

            // then
            return promise.then(() => {
              expect(Dropbox.prototype.filesListFolderContinue).to.have.been.calledThrice
              expect(Dropbox.prototype.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor' })
              expect(Dropbox.prototype.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor2' })
              expect(Dropbox.prototype.filesListFolderContinue).to.have.been.calledWith({ cursor: 'cursor3' })
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
        Dropbox.prototype.filesListFolder.rejects(new Error('Expected error'))

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
      sinon.stub(Dropbox.prototype, 'filesListFolder')
    })

    afterEach(() => {
      Dropbox.prototype.filesListFolder.restore()
    })

    describe('with a successful answer', () => {
      it('should return filtered file metadatas from dropbox', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() })

        // when
        const promise = DropboxClient.getFilesFolderPaths(idArticle)

        // then
        return promise.then(entries => {
          expect(entries).to.deep.equal(filteredDropboxPaths)
        })
      })

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() })

        // when
        DropboxClient.getFilesFolderPaths(idArticle)

        // then
        expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith({ path: '/59/', recursive: true })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesListFolder.rejects(new Error('Expected error'))

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
      sinon.stub(Dropbox.prototype, 'filesGetTemporaryLink')
      idArticle = 59
    })

    afterEach(() => {
      Dropbox.prototype.filesGetTemporaryLink.restore()
    })

    describe('with a successful answer', () => {
      it('should return link from dropbox answer', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink())

        // when
        const promise = DropboxClient.getFrTextFileStream(idArticle)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink().link)
        })
      })

      it('should call dropbox API "dropbox filesGetTemporaryLink" with path container idArticle', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink())

        // when
        DropboxClient.getFrTextFileStream(idArticle)

        // then
        expect(Dropbox.prototype.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/fr.php` })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.rejects(new Error('Expected error'))

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
      sinon.stub(Dropbox.prototype, 'filesGetTemporaryLink')
      idArticle = 59
    })

    afterEach(() => {
      Dropbox.prototype.filesGetTemporaryLink.restore()
    })

    describe('with a successful answer', () => {
      it('should return link from dropbox answer', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink())

        // when
        const promise = DropboxClient.getEnTextFileStream(idArticle)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink().link)
        })
      })

      it('should call dropbox API "dropbox filesGetTemporaryLink" with path container idArticle', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink())

        // when
        DropboxClient.getEnTextFileStream(idArticle)

        // then
        expect(Dropbox.prototype.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/en.php` })
      })
    })

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.rejects(new Error('Expected error'))

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

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'sharingCreateSharedLink')
      path = '/60/fr.php'
    })

    afterEach(() => {
      Dropbox.prototype.sharingCreateSharedLink.restore()
    })

    describe('with a successful answer', () => {
      it('should return created link', () => {
        // given
        Dropbox.prototype.sharingCreateSharedLink.resolves(dropboxFilesGetTemporaryLink)

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        return promise.then(link => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink)
        })
      })

      it('should call dropbox API "sharingCreateSharedLink" with path and short_url false', () => {
        // given
        Dropbox.prototype.sharingCreateSharedLink.resolves(dropboxFilesGetTemporaryLink)

        // when
        DropboxClient.createSharedLink(path)

        // then
        expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith({ path, short_url: false })
      })
    })

    describe('with an error', () => {
      beforeEach(() => {
        sinon.stub(console, 'error')
      })

      it('should return a rejected promise', done => {
        // given
        Dropbox.prototype.sharingCreateSharedLink.rejects(new Error('Expected error'))

        // when
        const promise = DropboxClient.createSharedLink(path)

        // then
        promise.then(link => {
          setTimeout(() => {
            expect(console.error).to.have.been.calledWith('Erreur lors de la création du lien de : ', '/60/fr.php')
            expect(console.error).to.have.been.calledWith('Erreur encore : ', '/60/fr.php')
            expect(console.error).to.have.been.callCount(4)
            console.error.restore()
            done()
          }, 1000)
          expect(link).to.deep.equal({})
        })
      })
    })
  })
})
