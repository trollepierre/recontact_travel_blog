const DropboxClient = require('../../../src/infrastructure/dropbox');
const { expect, sinon } = require('../../test-helper');
const Dropbox = require('dropbox');
const dropboxFilesListFolder = require('../fixtures/dropboxFilesListFolder');

describe('Unit | Utils | dropbox-client', () => {
  beforeEach(() => {
    sinon.stub(Dropbox.prototype, 'filesListFolder');
  });

  afterEach(() => {
    Dropbox.prototype.filesListFolder.restore();
  });

  /**
   * #getAllFileMetaDataInDropbox
   * ---------------
   */

  describe('#getAllFileMetaDataInDropbox', () => {
    describe('with a successful answer', () => {
      beforeEach(() => {
        Dropbox.prototype.filesListFolder.callsFake((options, callback) => {
          const httpResponse = {
            entries: dropboxFilesListFolder,
          };
          callback(null, httpResponse);
        });
      });

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // when
        const promise = DropboxClient.getAllFileMetaDataInDropbox();

        // then
        return promise.then(() => {
          const expectedPath = { path: '', recursive: true };
          expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith(expectedPath);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.getAllFileMetaDataInDropbox();

        // then
        return promise.then((response) => {
          expect(response).to.equal(dropboxFilesListFolder);
        });
      });
    });

    describe('with an error', () => {
      beforeEach(() => {
        Dropbox.prototype.filesListFolder.callsFake((options, callback) => {
          callback(new Error('Some error message'), null);
        });
      });

      it('should return a rejected promise', (done) => {
        // when
        const promise = DropboxClient.getAllFileMetaDataInDropbox();

        // then
        promise
          .catch((err) => {
            expect(err.message).to.equal('Some error message');
            done();
          });
      });
    });
  });

  /**
   * #shareImages
   * ---------------
   */

  describe.skip('#shareImages', () => {
    describe('with a successful answer', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.callsFake((options, callback) => {
          const httpResponse = dropboxFilesListFolder;
          callback(null, httpResponse);
        });
      });

      it('should call dropbox API "sharingCreateSharedLink" with emptyPath', () => {
        // when
        const promise = DropboxClient.shareImages();

        // then
        return promise.then(() => {
          const expectedPath = { path: '', recursive: true };
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith(expectedPath);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.shareImages();

        // then
        return promise.then((response) => {
          expect(response).to.equal(dropboxFilesListFolder);
        });
      });
    });

    describe('with an error', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.callsFake((options, callback) => {
          callback(new Error('Some error message'), null);
        });
      });

      it('should return a rejected promise', (done) => {
        // when
        const promise = DropboxClient.shareImages();

        // then
        promise
          .catch((err) => {
            expect(err.message).to.equal('Some error message');
            done();
          });
      });
    });
  });

});
