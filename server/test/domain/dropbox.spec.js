const DropboxClient = require('../../src/domain/external_services/dropbox-client');
const { expect, sinon } = require('../test-helper');
const Dropbox = require('dropbox');
const dropboxFilesListFolder = require('../unit/fixtures/dropboxFilesListFolder');
const dropboxFilesGetTemporaryLink = require('../unit/fixtures/dropboxFilesGetTemporaryLink');
const foldersInformation = require('../unit/fixtures/foldersInformation');
const articlesWithSharedLink = require('../unit/fixtures/articlesWithSharedLink');
const chaptersWithSharedLink = require('../unit/fixtures/chaptersWithSharedLink');
const serializedChapters = require('../unit/fixtures/serializedChaptersForInfraDb');
const dropboxSharedLinkCreate = require('../unit/fixtures/dropboxSharedLinkCreate');

describe('Unit | Infrastructure | dropbox-client', () => {
  describe('#getAllDropboxFoldersMetadatas', () => {
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
        const promise = DropboxClient.getAllDropboxFoldersMetadatas();

        // then
        return promise.then((entries) => {
          expect(entries).to.deep.equal(dropboxFilesListFolder);
        });
      });

      it('should call dropbox API "filesListFolder" with emptyPath', () => {
        // given
        Dropbox.prototype.filesListFolder.resolves({ entries: dropboxFilesListFolder });

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

  describe('#shareImages', () => {
    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'sharingCreateSharedLink');
    });

    afterEach(() => {
      Dropbox.prototype.sharingCreateSharedLink.restore();
    });

    describe('with a successful answer', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.resolves(dropboxSharedLinkCreate);
      });

      it('should call dropbox API "sharingCreateSharedLink" with emptyPath', () => {
        // when
        const promise = DropboxClient.shareImages(foldersInformation);

        // then
        return promise.then(() => {
          const expectedPath = { path: '/58/img0.jpg', short_url: false };
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith(expectedPath);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.shareImages(foldersInformation);

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
        const promise = DropboxClient.shareImages(foldersInformation);

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#getTextFileStream', () => {
    let idArticle;

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'filesGetTemporaryLink');
      idArticle = 59;
    });

    afterEach(() => {
      Dropbox.prototype.filesGetTemporaryLink.restore();
    });

    describe('with a successful answer', () => {
      it('should return all file metadata in dropbox', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink);

        // when
        const promise = DropboxClient.getTextFileStream(idArticle);

        // then
        return promise.then((link) => {
          expect(link).to.deep.equal(dropboxFilesGetTemporaryLink.link);
        });
      });

      it('should call dropbox API "dropboxFilesGetTemporaryLink" with emptyPath', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.resolves(dropboxFilesGetTemporaryLink);

        // when
        DropboxClient.getTextFileStream(idArticle);

        // then
        expect(Dropbox.prototype.filesGetTemporaryLink).to.have.been.calledWith({ path: `/${idArticle}/fr.php` });
      });
    });

    describe('with an error', () => {
      it('should return a rejected promise', () => {
        // given
        Dropbox.prototype.filesGetTemporaryLink.rejects(new Error('Expected error'));

        // when
        const promise = DropboxClient.getTextFileStream(idArticle);

        // then
        return promise.then(() => {
          throw new Error();
        }, (err) => {
          expect(err.message).to.equal('Expected error');
        });
      });
    });
  });

  describe('#shareChapterImages', () => {
    let idArticle;

    beforeEach(() => {
      sinon.stub(Dropbox.prototype, 'sharingCreateSharedLink');
      idArticle = 59;
    });

    afterEach(() => {
      Dropbox.prototype.sharingCreateSharedLink.restore();
    });

    describe('with a successful answer', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.resolves(dropboxSharedLinkCreate);
      });

      it('should call dropbox API "sharingCreateSharedLink" with one path per chapter', () => {
        // when
        const promise = DropboxClient.shareChapterImages(serializedChapters, idArticle);

        // then
        return promise.then(() => {
          const expectedOptions = { path: `/${idArticle}/img1.jpg`, short_url: false };
          const expectedOptions2 = { path: `/${idArticle}/img2.jpg`, short_url: false };
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledTwice;
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith(expectedOptions);
          expect(Dropbox.prototype.sharingCreateSharedLink).to.have.been.calledWith(expectedOptions2);
        });
      });

      it('should return url to show', () => {
        // when
        const promise = DropboxClient.shareChapterImages(serializedChapters, idArticle);

        // then
        return promise.then((response) => {
          expect(response).to.deep.equal(chaptersWithSharedLink);
        });
      });
    });

    describe('with an error', () => {
      beforeEach(() => {
        Dropbox.prototype.sharingCreateSharedLink.rejects(new Error('Expected error'));
      });

      it('should return a rejected promise', () => {
        // when
        const promise = DropboxClient.shareChapterImages(serializedChapters, idArticle);

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
