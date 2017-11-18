const DropboxClient = require('../../../src/infrastructure/external_services/dropbox-client');
const { expect, sinon } = require('../../test-helper');
const Dropbox = require('dropbox');
const dropboxFilesListFolder = require('../../fixtures/dropboxFilesListFolder');
const filteredDropboxFilesListFolder = require('../../fixtures/filteredDropboxFilesListFolder');
const filteredDropboxPaths = require('../../fixtures/filteredDropboxPaths');
const dropboxFilesGetTemporaryLink = require('../../fixtures/dropboxFilesGetTemporaryLink');

describe('Unit | Infrastructure | dropbox-client', () => {
  describe('#getAllDropboxFoldersMetadatas', () => {
    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesListFolder');
    });

    afterEach(() => {
      Dropbox.prototype.filesListFolder.restore();
    });

    describe('with a successful answer', () => {
      it('should return filtered file metadatas from dropbox', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() });

        // when
        const promise = DropboxClient.getAllDropboxFoldersMetadatas();

        // then
        return promise.then((entries) => {
          expect(entries).to.deep.equal([filteredDropboxFilesListFolder('58'), filteredDropboxFilesListFolder('59')]);
        });
      });

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() });

        // when
        DropboxClient.getAllDropboxFoldersMetadatas();

        // then
        expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith({ path: '', recursive: true });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesListFolder.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.getAllDropboxFoldersMetadatas();

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#getArticlePhotosPaths()', () => {
    const idArticle = 59;

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesListFolder');
    });

    afterEach(() => {
      Dropbox.prototype.filesListFolder.restore();
    });

    describe('with a successful answer', () => {
      it('should return filtered file metadatas from dropbox', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() });

        // when
        const promise = DropboxClient.getArticlePhotosPaths(idArticle);

        // then
        return promise.then((entries) => {
          expect(entries).to.deep.equal(filteredDropboxPaths);
        });
      });

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder() });

        // when
        DropboxClient.getArticlePhotosPaths(idArticle);

        // then
        expect(Dropbox.prototype.filesListFolder).to.have.been.calledWith({ path: '/59/', recursive: true });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesListFolder.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.getArticlePhotosPaths(idArticle);

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#getFrTextFileStream', () => {
    let idArticle;

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesGetTemporaryLink');
      idArticle = 59;
    });

    afterEach(() => {
      Dropbox.prototype.filesGetTemporaryLink.restore();
    });

    describe('with a successful answer', () => {
      it('should return link from dropbox answer', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink());

        // when
        const promise = DropboxClient.getFrTextFileStream(idArticle);

        // then
        return promise.then((link) => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink().link);
        });
      });

      it('should call dropbox API "dropbox filesGetTemporaryLink" with path container idArticle', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink());

        // when
        DropboxClient.getFrTextFileStream(idArticle);

        // then
        expect(Dropbox.prototype.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/fr.php` });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.getFrTextFileStream(idArticle);

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#getEnTextFileStream', () => {
    let idArticle;

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesGetTemporaryLink');
      idArticle = 59;
    });

    afterEach(() => {
      Dropbox.prototype.filesGetTemporaryLink.restore();
    });

    describe('with a successful answer', () => {
      it('should return link from dropbox answer', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink());

        // when
        const promise = DropboxClient.getEnTextFileStream(idArticle);

        // then
        return promise.then((link) => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink().link);
        });
      });

      it('should call dropbox API "dropbox filesGetTemporaryLink" with path container idArticle', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink());

        // when
        DropboxClient.getEnTextFileStream(idArticle);

        // then
        expect(Dropbox.prototype.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/en.php` });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.getEnTextFileStream(idArticle);

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#createSharedLink', () => {
    let path;

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'sharingCreateSharedLink');
      path = '/60/fr.php';
    });

    afterEach(() => {
      Dropbox.prototype.sharingCreateSharedLink.restore();
    });

    describe('with a successful answer', () => {
      it('should return created link', () => {
        // given
        Dropbox.prototype.sharingCreateSharedLink.resolves(dropboxFilesGetTemporaryLink);

        // when
        const promise = DropboxClient.createSharedLink(path);

        // then
        return promise.then((link) => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink);
        });
      });

      it('should call dropbox API "sharingCreateSharedLink" with path and short_url false', () => {
        // given
        Dropbox.prototype.sharingCreateSharedLink.resolves(dropboxFilesGetTemporaryLink);

        // when
        DropboxClient.createSharedLink(path);

        // then
        expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith({ path, short_url: false });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.sharingCreateSharedLink.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.createSharedLink(path);

        // then
        return promise.then((link) => {
          expect(link).to.deep.equal({});
        });
      });
    });
  });
});
