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
        Dropbox.prototype.filesListFolder.callsFake(() => Promise.resolve({
          entries: dropboxFilesListFolder,
        }));
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
        Dropbox.prototype.filesListFolder.callsFake(() => Promise.reject(new Error('Some error message')));
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
    const articles = [{
      name: '58',
      imgLink: '/58/img0.jpg',
    }, {
      name: '59',
      imgLink: '/59/img0.jpg',
    }];

    describe('with a successful answer', () => {
      const responseFromDropbox = {};

      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink
          .callsFake(() => Promise.resolve(responseFromDropbox));
      });

      it('should call dropbox API "sharingCreateSharedLink" with emptyPath', () => {
        // when
        const promise = DropboxClient.shareImages(articles);

        // then
        return promise.then(() => {
          const expectedPath = { path: '', recursive: true };
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith(expectedPath);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.shareImages(articles);

        // then
        return promise.then((response) => {
          expect(response).to.equal(dropboxFilesListFolder);
        });
      });
    });

    describe('with an error', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.callsFake(() => Promise.reject(new Error('Some error message')));
      });

      it('should return a rejected promise', (done) => {
        // when
        const promise = DropboxClient.shareImages(articles);

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
