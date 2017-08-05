const DropboxClient = require('../../../src/infrastructure/dropbox');
const { expect, sinon } = require('../../test-helper');
const Dropbox = require('dropbox');

describe('Unit | Utils | dropbox-client', () => {
  beforeEach(() => {
    sinon.stub(Dropbox.prototype, 'filesListFolder');
  });

  afterEach(() => {
    Dropbox.prototype.filesListFolder.restore();
  });

  /**
   * #getFile
   * ---------------
   */

  describe('#getFile', () => {
    describe('with a successful answer', () => {
      beforeEach(() => {
        Dropbox.prototype.filesListFolder.callsFake(() => Promise.resolve({
          entries: [{ name: 'fileName.jpg' }],
        }));
      });

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // when
        const promise = DropboxClient.getFile();

        // then
        return promise.then(() => {
          const expectedPath = { path: '' };
          expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith(expectedPath);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.getFile();

        // then
        return promise.then((response) => {
          expect(response).to.equal('https://www.dropbox.com/home/Applications/Recontact%20Travel%20Blog?preview=fileName.jpg');
        });
      });
    });

    describe('with an error', () => {
      beforeEach(() => {
        Dropbox.prototype.filesListFolder.callsFake(() => Promise.reject(new Error('Some error message')));
      });

      it('should return a rejected promise', (done) => {
        // when
        const promise = DropboxClient.getFile();

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
