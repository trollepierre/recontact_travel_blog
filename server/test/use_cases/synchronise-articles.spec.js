const { expect, sinon } = require('../test-helper');
const SynchroniseArticles = require('../../src/use_cases/synchronize-articles');
const ArticleRepository = require('../../src/domain/repositories/article-repository');
const ChapterRepository = require('../../src/domain/repositories/chapter-repository');
const PhotoRepository = require('../../src/domain/repositories/photo-repository');
const SubscriptionRepository = require('../../src/domain/repositories/subscription-repository');
const mailJet = require('../../src/infrastructure/mailing/mailjet');
const DropboxClient = require('../../src/infrastructure/external_services/dropbox-client');
const FileReader = require('../../src/infrastructure/external_services/file-reader');
const savedArticle = require('../fixtures/articleToSave');
const chapterOfArticle = require('../fixtures/chapterOfArticleSaved');
const filteredDropboxFilesListFolder = require('../fixtures/filteredDropboxFilesListFolder');
const dropboxPhotosPaths = require('../fixtures/filteredDropboxPaths');
const dropboxFilesGetTemporaryLink = require('../fixtures/dropboxFilesGetTemporaryLink');
const dropboxArticleFr = require('../fixtures/dropboxArticleFr');

describe('Unit | SynchroniseArticles | synchronizeArticles', () => {
  beforeEach(() => {
    const dropboxFolders = [
      filteredDropboxFilesListFolder('46'),
      filteredDropboxFilesListFolder('47'),
      filteredDropboxFilesListFolder('48'),
    ];
    sinon.stub(DropboxClient, 'getAllDropboxFoldersMetadatas').resolves(dropboxFolders);
  });

  afterEach(() => {
    DropboxClient.getAllDropboxFoldersMetadatas.restore();
  });

  describe('basic call', () => {
    beforeEach(() => {
      const oldArticles = [savedArticle('46'), savedArticle('47'), savedArticle('48')];
      sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles);
    });

    afterEach(() => {
      ArticleRepository.getAll.restore();
    });

    it('should call DropboxClient to getAllDropboxFoldersMetadatas', () => {
      // when
      SynchroniseArticles.synchronizeArticles();

      // then
      expect(DropboxClient.getAllDropboxFoldersMetadatas).to.have.been.calledWith();
    });
  });

  describe('when no new article has been added', () => {
    beforeEach(() => {
      const oldArticles = [savedArticle('46'), savedArticle('47'), savedArticle('48')];
      sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles);
    });

    afterEach(() => {
      ArticleRepository.getAll.restore();
    });

    it('should return chapters with paragraphs', () => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles();

      // then
      return promise.then((chapters) => {
        expect(chapters).to.deep.equal({
          addedArticles: [],
          hasChanges: false,
        });
      });
    });
  });

  describe('when a new article has been added', () => {
    beforeEach(() => {
      const subscriptions = [{ email: 'abonne@recontact.me' }];
      const oldArticles = [savedArticle('46')];
      sinon.stub(SubscriptionRepository, 'getAll').resolves(subscriptions);
      sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles);
      sinon.stub(ArticleRepository, 'updateName').resolves(oldArticles);
      sinon.stub(ArticleRepository, 'create')
        .resolves(savedArticle('47'))
        .resolves(savedArticle('48'));
      sinon.stub(ChapterRepository, 'createArticleChapters')
        .resolves(chapterOfArticle());
      sinon.stub(PhotoRepository, 'createPhotos');
      sinon.stub(DropboxClient, 'getArticlePhotosPaths').resolves(dropboxPhotosPaths);
      sinon.stub(DropboxClient, 'createSharedLink');
      sinon.stub(DropboxClient, 'getTextFileStream').resolves(dropboxFilesGetTemporaryLink().link);
      sinon.stub(FileReader, 'read').resolves(dropboxArticleFr);
      sinon.stub(mailJet, 'sendEmail').resolves({});
    });

    afterEach(() => {
      SubscriptionRepository.getAll.restore();
      ArticleRepository.getAll.restore();
      ArticleRepository.updateName.restore();
      ArticleRepository.create.restore();
      ChapterRepository.createArticleChapters.restore();
      PhotoRepository.createPhotos.restore();
      DropboxClient.getArticlePhotosPaths.restore();
      DropboxClient.createSharedLink.restore();
      DropboxClient.getTextFileStream.restore();
      FileReader.read.restore();
      mailJet.sendEmail.restore();
    });

    describe('when dropbbox can create shared link', () => {
      beforeEach(() => {
        DropboxClient.createSharedLink.resolves({ url: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1' });
      });

      it('should create shared link for each image path of the new articles ', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/img0.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/48/img0.jpg');
        });
      });

      it('should call ArticleRepository to create articlesToSave', () => {
        // given
        const articlesToSave = [{
          dropboxId: '47',
          galleryLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
          imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
        }, {
          dropboxId: '48',
          galleryLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
          imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
        }];

        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave);
        });
      });

      it('should call DropboxClient to get TextFileStream', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.getTextFileStream).to.have.been.calledWith('47');
          expect(DropboxClient.getTextFileStream).to.have.been.calledWith('48');
        });
      });

      it('should call FileReader to read twice', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(FileReader.read).to.have.been.calledTwice;
        });
      });

      it('should save new title', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(ArticleRepository.updateName).to.have.been.calledWith('59. Perdus autour du mont Gongga', '47');
          expect(ArticleRepository.updateName).to.have.been.calledWith('59. Perdus autour du mont Gongga', '48');
        });
      });

      it('should save photos', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(PhotoRepository.createPhotos).to.have.been.calledWith([{
            dropboxId: '47',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
          }, {
            dropboxId: '47',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
          }, {
            dropboxId: '48',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
          }, {
            dropboxId: '48',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
          }]);
        });
      });

      it('should create shared link 2 times (/47 + /47/img0) par articles (so 4 times) ' +
        '+ 2x2 initial calls (img1&img2 x2) per imgLink + 2x2 calls per galleryPhotosLink ', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.createSharedLink).to.have.been.callCount(12);
        });
      });

      it('should call chapter repository to create chapters of these articles', () => {
        // given
        const chaptersToSave = [
          {
            dropboxId: '47',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
            text: 'Rassemblant trois valeureux compagnons :' +
            "\r\n# - Pierre, l'expérimenté" +
            '\r\n# - Franzi, la photographe' +
            '\r\n# - Vincent, le guide à la carte' +
            '\r\n##' +
            "\r\nCe trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement...",
            title: 'Le trek incroyable autour du mont Gongga Par Pierre avec Vincent et Franzi',
          }, {
            dropboxId: '47',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
            text: 'La région de Kangding' +
            '\r\n#' +
            "\r\nSituée sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\"." +
            '\r\n##' +
            "\r\nLe mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !" +
            '\r\n#' +
            '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
            title: 'Le programme',
          },
          {
            dropboxId: '48',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
            text: 'Rassemblant trois valeureux compagnons :' +
            '\r\n# - Pierre, l\'expérimenté' +
            '\r\n# - Franzi, la photographe' +
            '\r\n# - Vincent, le guide à la carte' +
            '\r\n##' +
            "\r\nCe trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement...",
            title: 'Le trek incroyable autour du mont Gongga Par Pierre avec Vincent et Franzi',
          }, {
            dropboxId: '48',
            imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
            text: 'La région de Kangding' +
            '\r\n#' +
            "\r\nSituée sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\"." +
            '\r\n##' +
            "\r\nLe mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !" +
            '\r\n#' +
            '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
            title: 'Le programme',
          }];

        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(ChapterRepository.createArticleChapters).to.have.been.calledWith(chaptersToSave);
        });
      });

      it('should send email with correct options', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(mailJet.sendEmail).to.have.been.calledWith({
            from: 'contact@recontact.me',
            fromName: 'RecontactMe',
            to: ['abonne@recontact.me'],
            subject: '[RecontactMe] Il y a du nouveau sur le site !',
            template: '<p>Bonjour,</p><p>Il y a du nouveau du côté de <a href="http://centralamerica.recontact.me/#">Recontact Me</a>.</p>' +
            '<p>2 nouveaux articles :<ul>' +
            '<li><a href="http://centralamerica.recontact.me/#/articles/47">47</a></li>' +
            '<li><a href="http://centralamerica.recontact.me/#/articles/48">48</a></li>' +
            '</ul></p>',
          });
        });
      });

      it('should send email with correct options when there is one added article', () => {
        // given
        ArticleRepository.getAll.restore();
        const oldArticles = [savedArticle('46'), savedArticle('48')];
        sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles);

        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(mailJet.sendEmail).to.have.been.calledWith({
            from: 'contact@recontact.me',
            fromName: 'RecontactMe',
            to: ['abonne@recontact.me'],
            subject: '[RecontactMe] Il y a du nouveau sur le site !',
            template: '<p>Bonjour,</p><p>Il y a du nouveau du côté de <a href="http://centralamerica.recontact.me/#">Recontact Me</a>.</p>' +
            '<p>Un nouvel article :<ul>' +
            '<li><a href="http://centralamerica.recontact.me/#/articles/47">47</a></li>' +
            '</ul></p>',
          });
        });
      });

      it('should return result', () => {
        // given
        const expectedResult = {
          addedArticles: [
            {
              dropboxId: '47',
              galleryPath: '/47',
              imgPath: '/47/img0.jpg',
            },
            {
              dropboxId: '48',
              galleryPath: '/48',
              imgPath: '/48/img0.jpg',
            },
          ],
          hasChanges: true,
          receivers: [
            'abonne@recontact.me',
          ],
        };

        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then((result) => {
          expect(result).to.deep.equal(expectedResult);
        });
      });
    });

    describe('when dropbbox cannot create shared link', () => {
      beforeEach(() => {
        DropboxClient.createSharedLink.resolves({});
      });

      it('should call ArticleRepository to create articlesToSave with empty imgLink', () => {
        // given
        const articlesToSave = [{
          dropboxId: '47',
          galleryLink: '',
          imgLink: '',
        }, {
          dropboxId: '48',
          galleryLink: '',
          imgLink: '',
        }];

        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave);
        });
      });
    });
  });
});
