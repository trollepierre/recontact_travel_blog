const DropboxClient = require('../../../src/infrastructure/dropbox');
const { expect, sinon } = require('../../test-helper');
const Dropbox = require('dropbox');
const dropboxFilesListFolder = require('../fixtures/dropboxFilesListFolder');
const articles = require('../fixtures/articles');
const articlesWithSharedLink = require('../fixtures/articlesWithSharedLink');
const sharedLinkCreate = require('../fixtures/sharedLinkCreate');

describe('Unit | Utils | dropbox-client', () => {
  describe('#getAllFileMetaDataInDropbox', () => {
    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesListFolder');
    });

    afterEach(() => {
      Dropbox.prototype.filesListFolder.restore();
    });

    describe('with a successful answer', () => {
      it('should return all file metadata in dropbox', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder });

        // when
        const promise = DropboxClient.getAllFileMetaDataInDropbox();

        // then
        return promise.then((entries) => {
          expect(entries).to.deep.equal(dropboxFilesListFolder);
        });
      });

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder });

        // when
        DropboxClient.getAllFileMetaDataInDropbox();

        // then
        expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith({ path: '', recursive: true });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesListFolder.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.getAllFileMetaDataInDropbox();

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#shareImages', () => {
    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'sharingCreateSharedLink');
    });

    afterEach(() => {
      Dropbox.prototype.sharingCreateSharedLink.restore();
    });

    describe('with a successful answer', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.resolves(sharedLinkCreate);
      });

      it('should call dropbox API "sharingCreateSharedLink" with emptyPath', () => {
        // when
        const promise = DropboxClient.shareImages(articles);

        // then
        return promise.then(() => {
          const expectedPath = { path: '/58/img0.jpg', short_url: false };
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith(expectedPath);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.shareImages(articles);

        // then
        return promise.then((response) => {
          expect(response).to.deep.equal(articlesWithSharedLink);
        });
      });
    });

    describe('with an error', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.rejects(new Error('Expected error'));
      });

      it('should return a rejected promise', () => {
        // when
        const promise = DropboxClient.shareImages(articles);

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });
});
