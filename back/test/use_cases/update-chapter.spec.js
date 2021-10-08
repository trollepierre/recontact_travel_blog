import { expect, sinon } from '../test-helper'
import UpdateChapter from '../../src/use_cases/update-chapter'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import ChapterRepository from '../../src/domain/repositories/chapter-repository'
import PhotoRepository from '../../src/domain/repositories/photo-repository'
import mailJet from '../../src/infrastructure/mailing/mailjet'
import DropboxClient from '../../src/infrastructure/external_services/dropbox-client'
import FileReader from '../../src/infrastructure/external_services/file-reader'
import chapterOfArticle from '../fixtures/chapterOfArticleSaved'
import dropboxFilesGetTemporaryLink from '../fixtures/dropboxFilesGetTemporaryLink'
import dropboxArticleFr from '../fixtures/dropboxArticleFr'
import dropboxArticleEn from '../fixtures/dropboxArticleEn'
import dropboxPhotosPaths from '../fixtures/filteredDropboxPathsOfArticle'
import { dummyArticleFromDb } from '../dummies/dummyArticle'

describe('Unit | UpdateChapter | sync', () => {
  const dropboxId = 8
  const chapterPosition = 2

  beforeEach(() => {
    sinon.stub(console, 'error')
    sinon.stub(PhotoRepository, 'deletePhotosOfArticle').resolves()
    sinon.stub(ChapterRepository, 'deleteChapterOfArticle').resolves()
    sinon.stub(ArticleRepository, 'deleteByDropboxId').resolves()
    const oldArticles = [dummyArticleFromDb({ dropboxId: '46' })]
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
    ChapterRepository.deleteChapterOfArticle.restore()
    ArticleRepository.deleteByDropboxId.restore()
  })

  it('should call ChapterRepository to delete the Chapters Of the Article', () => {
    // when
    UpdateChapter.sync({ dropboxId, chapterPosition })

    // then
    expect(ChapterRepository.deleteChapterOfArticle).to.have.been.calledWith(dropboxId)
  })

  describe('when Dropbox can create shared link', () => {
    beforeEach(() => {
      DropboxClient.createSharedLink.resolves({ url: 'https://www.dropbox.com/s/lk0qiatmtdisoa4.jpg?dl=0' })
    })

    it('should call DropboxClient to get Fr TextFileStream', () => {
      // when
      const promise = UpdateChapter.sync({ dropboxId, chapterPosition })

      // then
      return promise.then(() => {
        expect(DropboxClient.getFrTextFileStream).to.have.been.calledWith(dropboxId)
      })
    })

    it('should call DropboxClient to get En TextFileStream', () => {
      // when
      const promise = UpdateChapter.sync({ dropboxId, chapterPosition })

      // then
      return promise.then(() => {
        expect(DropboxClient.getEnTextFileStream).to.have.been.calledWith(dropboxId)
      })
    })

    it('should call FileReader to read', () => {
      // when
      const promise = UpdateChapter.sync({ dropboxId, chapterPosition })

      // then
      return promise.then(() => {
        expect(FileReader.read).to.have.been.called
      })
    })

    it('should create shared link ONCE', () => {
      // when
      const promise = UpdateChapter.sync({ dropboxId, chapterPosition })

      // then
      return promise.then(() => {
        expect(DropboxClient.createSharedLink).to.have.been.callCount(1)
      })
    })

    it('should call chapter repository to create THE chapter of this article', () => {
      // given
      const chaptersToSave = [{
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
      const promise = UpdateChapter.sync({ dropboxId, chapterPosition })

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
      const promise = UpdateChapter.sync({ dropboxId, chapterPosition })

      // then
      return promise.then(result => {
        expect(result).to.deep.equal(expectedResult)
      })
    })
  })
})
