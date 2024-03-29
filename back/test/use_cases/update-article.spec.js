import { expect, sinon } from '../test-helper'
import UpdateArticle from '../../src/use_cases/update-article'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import ChapterRepository from '../../src/domain/repositories/chapter-repository'
import PhotoRepository from '../../src/domain/repositories/photo-repository'
import SubscriptionRepository from '../../src/domain/repositories/subscription-repository'
import mailJet from '../../src/infrastructure/mailing/mailjet'
import DropboxClient from '../../src/infrastructure/external_services/dropbox-client'
import FileReader from '../../src/infrastructure/external_services/file-reader'
import chapterOfArticle from '../fixtures/chapterOfArticleSaved'
import dropboxFilesGetTemporaryLink from '../fixtures/dropboxFilesGetTemporaryLink'
import dropboxArticleFr from '../fixtures/dropboxArticleFr'
import dropboxArticleEn from '../fixtures/dropboxArticleEn'
import dropboxPhotosPaths from '../fixtures/filteredDropboxPathsOfArticle'
import { dummyArticleFromDb } from '../dummies/dummyArticle'

describe('Unit | UpdateArticle | sync', () => {
  const dropboxId = 8

  beforeEach(() => {
    sinon.stub(console, 'error')
    sinon.stub(PhotoRepository, 'deletePhotosOfArticle').resolves()
    sinon.stub(ChapterRepository, 'deleteChaptersOfArticle').resolves()
    sinon.stub(ArticleRepository, 'deleteByDropboxId').resolves()
    const subscriptions = [{ email: 'abonne@recontact.me' }]
    const oldArticles = [dummyArticleFromDb({ dropboxId: '46' })]
    sinon.stub(SubscriptionRepository, 'getAll').resolves(subscriptions)
    sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles)
    sinon.stub(ArticleRepository, 'update').resolves(oldArticles)
    sinon.stub(ArticleRepository, 'create')
      .resolves(dummyArticleFromDb({ dropboxId: '47' }))
      .resolves(dummyArticleFromDb({ dropboxId: '48' }))
    sinon.stub(ChapterRepository, 'createArticleChapters')
      .resolves(chapterOfArticle())
    sinon.stub(PhotoRepository, 'createPhotos')
    sinon.stub(DropboxClient, 'getFilesFolderPaths').resolves(dropboxPhotosPaths)
    sinon.stub(DropboxClient, 'createSharedLink').resolves()
    sinon.stub(DropboxClient, 'getFrTextFileStream').resolves(dropboxFilesGetTemporaryLink().link)
    sinon.stub(DropboxClient, 'getEnTextFileStream').resolves(dropboxFilesGetTemporaryLink().link)
    sinon.stub(FileReader, 'read')
      .resolves(dropboxArticleFr)
      .resolves(dropboxArticleEn)
    sinon.stub(mailJet, 'sendEmail').resolves({})
  })

  afterEach(() => {
    console.error.restore()
    SubscriptionRepository.getAll.restore()
    ArticleRepository.getAll.restore()
    ArticleRepository.update.restore()
    ArticleRepository.create.restore()
    ChapterRepository.createArticleChapters.restore()
    PhotoRepository.createPhotos.restore()
    DropboxClient.getFilesFolderPaths.restore()
    DropboxClient.createSharedLink.restore()
    DropboxClient.getFrTextFileStream.restore()
    DropboxClient.getEnTextFileStream.restore()
    FileReader.read.restore()
    mailJet.sendEmail.restore()
    PhotoRepository.deletePhotosOfArticle.restore()
    ChapterRepository.deleteChaptersOfArticle.restore()
    ArticleRepository.deleteByDropboxId.restore()
  })

  it('should call ChapterRepository to delete the Chapters Of the Article', () => {
    // when
    UpdateArticle.sync(dropboxId)

    // then
    expect(ChapterRepository.deleteChaptersOfArticle).to.have.been.calledWith(dropboxId)
  })

  it('should call PhotoRepository to delete the Photos Of the Article', () => {
    // when
    UpdateArticle.sync(dropboxId)

    // then
    expect(PhotoRepository.deletePhotosOfArticle).to.have.been.calledWith(dropboxId)
  })

  it('should call ArticleRepository to delete the article', () => {
    // when
    UpdateArticle.sync(dropboxId)

    // then
    expect(ArticleRepository.deleteByDropboxId).to.have.been.calledWith(dropboxId)
  })

  describe('when Dropbox can create shared link', () => {
    beforeEach(() => {
      DropboxClient.createSharedLink.resolves({ url: 'https://www.dropbox.com/s/lk0qiatmtdisoa4.jpg?dl=0' })
    })

    it('should create shared link for each image path of the new articles ', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(DropboxClient.createSharedLink).to.have.been.calledWith(`/${dropboxId}/img0.jpg`)
      })
    })

    it('should call ArticleRepository to create articlesToSave', () => {
      // given
      const articlesToSave = [{
        dropboxId,
        galleryLink: 'https://www.dropbox.com/s/lk0qiatmtdisoa4.jpg?dl=0',
        imgLink: 'https://www.dropbox.com/s/raw/lk0qiatmtdisoa4.jpg',
      }]

      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave)
      })
    })

    it('should call DropboxClient to get Fr TextFileStream', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(DropboxClient.getFrTextFileStream).to.have.been.calledWith(dropboxId)
      })
    })

    it('should call DropboxClient to get En TextFileStream', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(DropboxClient.getEnTextFileStream).to.have.been.calledWith(dropboxId)
      })
    })

    it('should call FileReader to read', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(FileReader.read).to.have.been.called
      })
    })

    it('should save new title', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(ArticleRepository.update).to.have.been.calledWith({
          enTitle: '59. Lost autour du mont Gongga',
          frTitle: '59. Lost autour du mont Gongga',
        }, dropboxId)
      })
    })

    it('should save photos', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(PhotoRepository.createPhotos).to.have.been.calledWith([{
          dropboxId: 8,
          imgLink: 'https://www.dropbox.com/s/raw/lk0qiatmtdisoa4.jpg',
        },
        {
          dropboxId: 8,
          imgLink: 'https://www.dropbox.com/s/raw/lk0qiatmtdisoa4.jpg',
        },
        {
          dropboxId: 8,
          imgLink: 'https://www.dropbox.com/s/raw/lk0qiatmtdisoa4.jpg',
        },
        ])
      })
    })

    it('should create shared link each times par articles + one for folder', () => {
      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(DropboxClient.createSharedLink).to.have.been.callCount(7)
      })
    })

    it('should call chapter repository to create chapters of this article', () => {
      // given
      const chaptersToSave = [
        {
          position: 1,
          dropboxId: 8,
          imgLink: 'https://www.dropbox.com/s/raw/lk0qiatmtdisoa4.jpg',
          frText: 'Gathering trois valeureux compagnons :'
          + '\r\n# - Pierre, l\'expérimenté'
          + '\r\n# - Franzi, la photographe'
          + '\r\n# - Vincent, le guide à la carte'
          + '\r\n##'
          + '\r\nCe trek avait sur le papier, tout d\'un long fleuve tranquille... Le destin en a décidé autrement...',
          enText: 'Gathering trois valeureux compagnons :'
          + '\r\n# - Pierre, l\'expérimenté'
          + '\r\n# - Franzi, la photographe'
          + '\r\n# - Vincent, le guide à la carte'
          + '\r\n##'
          + '\r\nCe trek avait sur le papier, tout d\'un long fleuve tranquille... Le destin en a décidé autrement...',
          frTitle: 'Le trek incroyable autour du mont Gongga - Par Pierre avec Vincent et Franzi',
          enTitle: 'Le trek incroyable autour du mont Gongga - Par Pierre avec Vincent et Franzi',

        }, {
          position: 2,
          dropboxId: 8,
          imgLink: 'https://www.dropbox.com/s/raw/lk0qiatmtdisoa4.jpg',
          frText: 'La région de Kangding'
          + '\r\n#'
          + '\r\nSituée sur l\'autoroute menant au Tibet à l\'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du "Tibet".'
          + '\r\n##'
          + '\r\nLe mont Gongga (Minya Konka) pointe à 7556m d\'altitude, mais nous le longerons et ne passerons qu\'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !'
          + '\r\n#'
          + '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
          enText: 'La région de Kangding'
          + '\r\n#'
          + '\r\nSituée sur l\'autoroute menant au Tibet à l\'ouest du Sichuan, on se situe dans les montagnes où vivent majoritairement les tibétains. Bref le Tibet hors du "Tibet".'
          + '\r\n##'
          + '\r\nLe mont Gongga (Minya Konka) pointe à 7556m d\'altitude, mais nous le longerons et ne passerons qu\'un col à 4800m. Départ à 3500m, le col à passer le troisième jour, et deux jours pour traverser une chaîne de vallées creusée par les énormes rivières Riwuqie et Moxi Gou. Cela paraît un beau programme !'
          + '\r\n#'
          + '\r\nLe trek est de difficulté moyenne, nous anticipons la nourriture pour six jours au cas où.',
          frTitle: 'Le programme',
          enTitle: 'Le programme',
        },
      ]

      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(ChapterRepository.createArticleChapters).to.have.been.calledWith(chaptersToSave)
      })
    })

    it('should return result', () => {
      // given
      const expectedResult = {
        addedArticles: [
          {
            dropboxId,
            galleryPath: `/${dropboxId}`,
            imgPath: `/${dropboxId}/img0.jpg`,
          },
        ],
      }

      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(result => {
        expect(result).to.deep.equal(expectedResult)
      })
    })
  })

  describe('when Dropbox cannot create shared link', () => {
    beforeEach(() => {
      DropboxClient.createSharedLink.resolves({})
    })

    it('should call ArticleRepository to create articlesToSave with empty imgLink', () => {
      // given
      const articlesToSave = [{
        dropboxId,
        galleryLink: '',
        imgLink: '',
      }]

      // when
      const promise = UpdateArticle.sync(dropboxId)

      // then
      return promise.then(() => {
        expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave)
      })
    })
  })
})
