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
const dropboxArticleEn = require('../fixtures/dropboxArticleEn');
const { flatten } = require('lodash');

describe('Unit | SynchroniseArticles | synchronizeArticles', () => {
  beforeEach(() => {
    const dropboxFolders = flatten([
      filteredDropboxFilesListFolder('46'),
      filteredDropboxFilesListFolder('47'),
      filteredDropboxFilesListFolder('48'),
    ]);
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
      const subscriptions = [
        { email: 'abonne@recontact.me', lang: 'fr' },
        { email: 'subscriber@recontact.me', lang: 'en' },
      ];
      const oldArticles = [savedArticle('46')];
      sinon.stub(SubscriptionRepository, 'getAll').resolves(subscriptions);
      sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles);
      sinon.stub(ArticleRepository, 'update').resolves(oldArticles);
      const articleRepoCreateStub = sinon.stub(ArticleRepository, 'create');
      articleRepoCreateStub.onFirstCall().resolves(savedArticle('47'));
      articleRepoCreateStub.onSecondCall().resolves(savedArticle('48'));
      sinon.stub(ChapterRepository, 'createArticleChapters').resolves(chapterOfArticle());
      sinon.stub(PhotoRepository, 'createPhotos');
      sinon.stub(DropboxClient, 'getFilesFolderPaths').resolves(dropboxPhotosPaths);
      sinon.stub(DropboxClient, 'createSharedLink');
      sinon.stub(DropboxClient, 'getFrTextFileStream').resolves(dropboxFilesGetTemporaryLink().link);
      sinon.stub(DropboxClient, 'getEnTextFileStream').resolves(dropboxFilesGetTemporaryLink().link);
      const fileReaderReadStub = sinon.stub(FileReader, 'read');
      fileReaderReadStub.onFirstCall().resolves(dropboxArticleFr);
      fileReaderReadStub.onSecondCall().resolves(dropboxArticleEn);
      fileReaderReadStub.onThirdCall().resolves(dropboxArticleFr);
      fileReaderReadStub.onCall(3).resolves(dropboxArticleEn);
      sinon.stub(mailJet, 'sendEmail').resolves({});
    });

    afterEach(() => {
      SubscriptionRepository.getAll.restore();
      ArticleRepository.getAll.restore();
      ArticleRepository.update.restore();
      ArticleRepository.create.restore();
      ChapterRepository.createArticleChapters.restore();
      PhotoRepository.createPhotos.restore();
      DropboxClient.getFilesFolderPaths.restore();
      DropboxClient.createSharedLink.restore();
      DropboxClient.getFrTextFileStream.restore();
      DropboxClient.getEnTextFileStream.restore();
      FileReader.read.restore();
      mailJet.sendEmail.restore();
    });

    describe('when dropbox can create shared link', () => {
      beforeEach(() => {
        for (let i = 0; i < 20; i += 1) {
          DropboxClient.createSharedLink.onCall(i).resolves({ url: `db.com/call${i}.jpg?dl=1` });
        }
      });

      it('should create shared link for each image path of the new articles ', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/Img-0.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/48/Img-0.jpg');
        });
      });

      it('should call ArticleRepository to create articlesToSave', () => {
        // given
        const articlesToSave = [{
          dropboxId: '47',
          galleryLink: 'db.com/call1.jpg?dl=1',
          imgLink: 'db.com/call0.jpg?dl=1',
        }, {
          dropboxId: '48',
          galleryLink: 'db.com/call3.jpg?dl=1',
          imgLink: 'db.com/call2.jpg?dl=1',
        }];

        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave);
        });
      });

      it('should call DropboxClient to get Fr TextFileStream', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.getFrTextFileStream).to.have.been.calledWith('47');
          expect(DropboxClient.getFrTextFileStream).to.have.been.calledWith('48');
        });
      });

      it('should call DropboxClient to get En TextFileStream', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.getEnTextFileStream).to.have.been.calledWith('47');
          expect(DropboxClient.getEnTextFileStream).to.have.been.calledWith('48');
        });
      });

      it('should call FileReader to read twice', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(FileReader.read).to.have.been.callCount(4);
        });
      });

      it('should save new title', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          const article = {
            frTitle: '59. Perdus autour du mont Gongga',
            enTitle: '59. Lost autour du mont Gongga',
          };
          expect(ArticleRepository.update).to.have.been.calledWith(article, '47');
          expect(ArticleRepository.update).to.have.been.calledWith(article, '48');
        });
      });

      it('should save photos', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(PhotoRepository.createPhotos).to.have.been.calledWith([{
            dropboxId: '47',
            imgLink: 'db.com/call8.jpg?dl=1',
          }, {
            dropboxId: '47',
            imgLink: 'db.com/call9.jpg?dl=1',
          }, {
            dropboxId: '47',
            imgLink: 'db.com/call10.jpg?dl=1',
          }, {
            dropboxId: '48',
            imgLink: 'db.com/call11.jpg?dl=1',
          }, {
            dropboxId: '48',
            imgLink: 'db.com/call12.jpg?dl=1',
          }, {
            dropboxId: '48',
            imgLink: 'db.com/call13.jpg?dl=1',
          }]);
        });
      });

      it('should create shared link 2 times per photos + one for folder = 7 times two articles', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles();

        // then
        return promise.then(() => {
          expect(DropboxClient.createSharedLink).to.have.been.callCount(14);
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/Img-0.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/48/Img-0.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/48');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/img1.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/img2.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/48/img1.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/48/img2.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_180834.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_180839.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/IMG_2mggh.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_180834.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_180839.jpg');
          expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/IMG_2mggh.jpg');
        });
      });

      it('should call chapter repository to create chapters of these articles', () => {
        // given
        const chaptersToSave = [
          {
            dropboxId: '47',
            imgLink: 'db.com/call4.jpg?dl=1',
            frText: 'Rassemblant trois valeureux compagnons :' +
            '\r\n# - Pierre, l\'expérimenté' +
            '\r\n# - Franzi, la photographe' +
            '\r\n# - Vincent, le guide à la carte' +
            '\r\n##' +
            "\r\nCe trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement...",
            enText: 'Gathering trois valeureux compagnons :' +
            '\r\n# - Pierre, l\'expérimenté' +
            '\r\n# - Franzi, la photographe' +
            '\r\n# - Vincent, le guide à la carte' +
            '\r\n##' +
            "\r\nCe trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement...",
            frTitle: 'Le trek incroyable autour du mont Gongga - Par Pierre avec Vincent et Franzi',
            enTitle: 'Le trek incroyable autour du mont Gongga - Par Pierre avec Vincent et Franzi',

          }, {
            dropboxId: '47',
            imgLink: 'db.com/call5.jpg?dl=1',
            frText: 'La région de Kangding' +
            '\r\n#' +
            "\r\nSituée sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\"." +
            '\r\n##' +
            "\r\nLe mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !" +
            '\r\n#' +
            '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
            enText: 'La région de Kangding' +
            '\r\n#' +
            "\r\nSituée sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\"." +
            '\r\n##' +
            "\r\nLe mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !" +
            '\r\n#' +
            '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
            frTitle: 'Le programme',
            enTitle: 'Le programme',
          },
          {
            dropboxId: '48',
            imgLink: 'db.com/call6.jpg?dl=1',
            frText: 'Rassemblant trois valeureux compagnons :' +
            '\r\n# - Pierre, l\'expérimenté' +
            '\r\n# - Franzi, la photographe' +
            '\r\n# - Vincent, le guide à la carte' +
            '\r\n##' +
            "\r\nCe trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement...",
            enText: 'Gathering trois valeureux compagnons :' +
            '\r\n# - Pierre, l\'expérimenté' +
            '\r\n# - Franzi, la photographe' +
            '\r\n# - Vincent, le guide à la carte' +
            '\r\n##' +
            "\r\nCe trek avait sur le papier, tout d'un long fleuve tranquille... Le destin en a décidé autrement...",
            frTitle: 'Le trek incroyable autour du mont Gongga - Par Pierre avec Vincent et Franzi',
            enTitle: 'Le trek incroyable autour du mont Gongga - Par Pierre avec Vincent et Franzi',
          }, {
            dropboxId: '48',
            imgLink: 'db.com/call7.jpg?dl=1',
            frText: 'La région de Kangding' +
            '\r\n#' +
            "\r\nSituée sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\"." +
            '\r\n##' +
            "\r\nLe mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !" +
            '\r\n#' +
            '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
            enText: 'La région de Kangding' +
            '\r\n#' +
            "\r\nSituée sur l'autoroute menant au Tibet à l'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du \"Tibet\"." +
            '\r\n##' +
            "\r\nLe mont Gongga (Minya Konka) pointe à 7556m d'altitude, mais nous le longerons et ne passerons qu'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !" +
            '\r\n#' +
            '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
            frTitle: 'Le programme',
            enTitle: 'Le programme',
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
            template: '<p>Bonjour,</p><p>Il y a du nouveau du côté de <a href="http://www.recontact.me/#">Recontact Me</a>.</p>' +
            '<p>2 nouveaux articles :<ul>' +
            '<li><a href="http://www.recontact.me/#/articles/47">59. Perdus autour du mont Gongga</a></li>' +
            '<li><a href="http://www.recontact.me/#/articles/48">59. Perdus autour du mont Gongga</a></li>' +
            '</ul></p>',
          });
          expect(mailJet.sendEmail).to.have.been.calledWith({
            from: 'contact@recontact.me',
            fromName: 'RecontactMe',
            to: ['subscriber@recontact.me'],
            subject: '[RecontactMe] Some news on the website !',
            template: '<p>Hello,</p><p>There are some news on <a href="http://www.recontact.me/#">Recontact Me</a>.</p>' +
            '<p>2 new articles:<ul>' +
            '<li><a href="http://www.recontact.me/#/articles/47">59. Lost autour du mont Gongga</a></li>' +
            '<li><a href="http://www.recontact.me/#/articles/48">59. Lost autour du mont Gongga</a></li>' +
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
            template: '<p>Bonjour,</p><p>Il y a du nouveau du côté de <a href="http://www.recontact.me/#">Recontact Me</a>.</p>' +
            '<p>Un nouvel article :<ul>' +
            '<li><a href="http://www.recontact.me/#/articles/47">59. Perdus autour du mont Gongga</a></li>' +
            '</ul></p>',
          });
          expect(mailJet.sendEmail).to.have.been.calledWith({
            from: 'contact@recontact.me',
            fromName: 'RecontactMe',
            to: ['subscriber@recontact.me'],
            subject: '[RecontactMe] Some news on the website !',
            template: '<p>Hello,</p><p>There are some news on <a href="http://www.recontact.me/#">Recontact Me</a>.</p>' +
            '<p>One new article:<ul>' +
            '<li><a href="http://www.recontact.me/#/articles/47">59. Lost autour du mont Gongga</a></li>' +
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
              enTitle: '59. Lost autour du mont Gongga',
              frTitle: '59. Perdus autour du mont Gongga',
              galleryPath: '/47',
              imgPath: '/47/Img-0.jpg',
            },
            {
              dropboxId: '48',
              enTitle: '59. Lost autour du mont Gongga',
              frTitle: '59. Perdus autour du mont Gongga',
              galleryPath: '/48',
              imgPath: '/48/Img-0.jpg',
            },
          ],
          hasChanges: true,
          receivers: [
            {
              email: 'abonne@recontact.me',
              lang: 'fr',
            },
            {
              email: 'subscriber@recontact.me',
              lang: 'en',
            },
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
