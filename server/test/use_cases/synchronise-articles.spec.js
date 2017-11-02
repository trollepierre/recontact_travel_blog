const { expect, sinon } = require('../test-helper');
const SynchroniseArticles = require('../../src/use_cases/synchronize-articles');
const ArticleRepository = require('../../src/domain/repositories/article-repository');
const ChapterRepository = require('../../src/domain/repositories/chapter-repository');
const DropboxClient = require('../../src/infrastructure/external_services/dropbox-client');
const FileReader = require('../../src/infrastructure/external_services/file-reader');
const savedArticle = require('../fixtures/articleToSave');
const chapterOfArticle = require('../fixtures/chapterOfArticleSaved');
const filteredDropboxFilesListFolder = require('../fixtures/filteredDropboxFilesListFolder');
const dropboxFilesGetTemporaryLink = require('../fixtures/dropboxFilesGetTemporaryLink');
const dropboxArticleFr = require('../fixtures/dropboxArticleFr');

describe('Unit | SynchroniseArticles | synchronizeArticles', () => {
  const dropboxId = 25;

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
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

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
      const oldArticles = [savedArticle('46')];
      sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles);
      sinon.stub(ArticleRepository, 'create')
        .resolves(savedArticle('47'))
        .resolves(savedArticle('48'));
      sinon.stub(ChapterRepository, 'createArticleChapters')
        .resolves(chapterOfArticle());
      sinon.stub(DropboxClient, 'createSharedLink').resolves({ url: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1' });
      sinon.stub(DropboxClient, 'getTextFileStream').resolves(dropboxFilesGetTemporaryLink().link);
      sinon.stub(FileReader, 'read').resolves(dropboxArticleFr);
    });

    afterEach(() => {
      ArticleRepository.getAll.restore();
      ArticleRepository.create.restore();
      ChapterRepository.createArticleChapters.restore();
      DropboxClient.createSharedLink.restore();
      DropboxClient.getTextFileStream.restore();
      FileReader.read.restore();
    });

    it('should create shared link for each image path of the new articles ', () => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

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
        imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
      }, {
        dropboxId: '48',
        imgLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4/img0.jpg?dl=1',
      }];

      // when
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

      // then
      return promise.then(() => {
        expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave);
      });
    });

    it('should call DropboxClient to get TextFileStream', () => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

      // then
      return promise.then(() => {
        expect(DropboxClient.getTextFileStream).to.have.been.calledWith('47');
        expect(DropboxClient.getTextFileStream).to.have.been.calledWith('48');
      });
    });

    it('should call FileReader to read twice', () => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

      // then
      return promise.then(() => {
        expect(FileReader.read).to.have.been.calledTwice;
      });
    });

    it('should create shared link 2 times par articles (so 4 times) + 2 initial calls', () => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

      // then
      return promise.then(() => {
        expect(DropboxClient.createSharedLink).to.have.been.callCount(6);
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
      const promise = SynchroniseArticles.synchronizeArticles(dropboxId);

      // then
      return promise.then(() => {
        expect(ChapterRepository.createArticleChapters).to.have.been.calledWith(chaptersToSave);
      });
    });
  });
});
