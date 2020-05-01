import { flatten } from 'lodash'
import { expect, sinon } from '../test-helper'
import SynchroniseArticles from '../../src/use_cases/synchronize-articles'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import ChapterRepository from '../../src/domain/repositories/chapter-repository'
import PhotoRepository from '../../src/domain/repositories/photo-repository'
import SubscriptionRepository from '../../src/domain/repositories/subscription-repository'
import mailJet from '../../src/infrastructure/mailing/mailjet'
import DropboxClient from '../../src/infrastructure/external_services/dropbox-client'
import FileReader from '../../src/infrastructure/external_services/file-reader'
import savedArticle from '../fixtures/articleToSave'
import chapterOfArticle from '../fixtures/chapterOfArticleSaved'
import filteredDropboxFilesListFolder from '../fixtures/filteredDropboxFilesListFolder'
import dropboxPhotosPaths from '../fixtures/filteredDropboxPaths'
import dropboxFilesGetTemporaryLink from '../fixtures/dropboxFilesGetTemporaryLink'
import dropboxArticleFr from '../fixtures/dropboxArticleFr'
import dropboxArticleEn from '../fixtures/dropboxArticleEn'

describe('Unit | SynchroniseArticles | synchronizeArticles', () => {
  describe('when dropbox rejects error', () => {
    const error = new Error()

    beforeEach(() => {
      sinon.stub(DropboxClient, 'getAllDropboxFoldersMetadatas').rejects(error)
      sinon.stub(mailJet, 'sendEmail').resolves({})
    })

    afterEach(() => {
      DropboxClient.getAllDropboxFoldersMetadatas.restore()
      mailJet.sendEmail.restore()
    })

    it('should send mail to support', done => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles()

      // then
      promise.catch(() => {
        expect(mailJet.sendEmail).to.have.been.calledWith({
          from: 'contact-localhost@recontact.me',
          fromName: 'RecontactMe',
          to: ['support-localhost@recontact.me'],
          subject: '[RecontactMe] Il y a des erreurs sur le site !',
          template: '<p>{}</p>',
        })
        done()
      })
    })

    it('should throw error', done => {
      // when
      const promise = SynchroniseArticles.synchronizeArticles()

      // then
      promise.catch(catchedError => {
        expect(catchedError).to.deep.equal(error)
        done()
      })
    })
  })

  describe('when dropbox is successful', () => {
    const idOldArticle = '46'
    const idNewArticle1 = '47'
    const idNewArticle2 = '5'

    beforeEach(() => {
      const dropboxFolders = flatten([
        filteredDropboxFilesListFolder(idOldArticle),
        filteredDropboxFilesListFolder(idNewArticle1),
        filteredDropboxFilesListFolder(idNewArticle2),
      ])
      sinon.stub(DropboxClient, 'getAllDropboxFoldersMetadatas').resolves(dropboxFolders)
    })

    afterEach(() => {
      DropboxClient.getAllDropboxFoldersMetadatas.restore()
    })

    describe('basic call', () => {
      beforeEach(() => {
        const oldArticles = [savedArticle(idOldArticle), savedArticle(idNewArticle1), savedArticle(idNewArticle2)]
        sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles)
      })

      afterEach(() => {
        ArticleRepository.getAll.restore()
      })

      it('should call DropboxClient to getAllDropboxFoldersMetadatas', () => {
        // when
        SynchroniseArticles.synchronizeArticles()

        // then
        expect(DropboxClient.getAllDropboxFoldersMetadatas).to.have.been.calledWith()
      })
    })

    describe('when no new article has been added', () => {
      beforeEach(() => {
        const oldArticles = [savedArticle(idOldArticle), savedArticle(idNewArticle1), savedArticle(idNewArticle2)]
        sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles)
      })

      afterEach(() => {
        ArticleRepository.getAll.restore()
      })

      it('should return chapters with paragraphs', () => {
        // when
        const promise = SynchroniseArticles.synchronizeArticles()

        // then
        return promise.then(chapters => {
          expect(chapters).to.deep.equal({
            addedArticles: [],
            hasChanges: false,
          })
        })
      })
    })

    describe('when a new article has been added', () => {
      beforeEach(() => {
        const subscriptions = [
          { email: 'abonne@recontact.me', lang: 'fr' },
          { email: 'subscriber@recontact.me', lang: 'en' },
        ]
        const oldArticles = [savedArticle(idOldArticle)]
        sinon.stub(SubscriptionRepository, 'getAll').resolves(subscriptions)
        sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles)
        sinon.stub(ArticleRepository, 'update').resolves(oldArticles)
        const articleRepoCreateStub = sinon.stub(ArticleRepository, 'create')
        articleRepoCreateStub.onFirstCall().resolves(savedArticle(idNewArticle1))
        articleRepoCreateStub.onSecondCall().resolves(savedArticle(idNewArticle2))
        sinon.stub(ChapterRepository, 'createArticleChapters').resolves(chapterOfArticle())
        sinon.stub(PhotoRepository, 'createPhotos')
        sinon.stub(DropboxClient, 'getFilesFolderPaths').resolves(dropboxPhotosPaths)
        sinon.stub(DropboxClient, 'createSharedLink').resolves()
        sinon.stub(DropboxClient, 'getFrTextFileStream').resolves(dropboxFilesGetTemporaryLink().link)
        sinon.stub(DropboxClient, 'getEnTextFileStream').resolves(dropboxFilesGetTemporaryLink().link)
        const fileReaderReadStub = sinon.stub(FileReader, 'read')
        fileReaderReadStub.onFirstCall().resolves(dropboxArticleFr)
        fileReaderReadStub.onSecondCall().resolves(dropboxArticleEn)
        fileReaderReadStub.onThirdCall().resolves(dropboxArticleFr)
        fileReaderReadStub.onCall(3).resolves(dropboxArticleEn)
        fileReaderReadStub.onCall(4).resolves(dropboxArticleFr)
        fileReaderReadStub.onCall(5).resolves(dropboxArticleEn)
        sinon.stub(mailJet, 'sendEmail').resolves({})
      })

      afterEach(() => {
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
      })

      describe('when dropbox can create shared link', () => {
        beforeEach(() => {
          for (let i = 0; i < 20; i += 1) {
            DropboxClient.createSharedLink.onCall(i).resolves({ url: `db.com/call${i}.jpg?dl=0` })
          }
        })

        it('should create shared link for each image path of the new articles ', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/Img-0.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/5/Img-0.jpg')
          })
        })

        it('should call ArticleRepository to create articlesToSave', () => {
          // given
          const articlesToSave = [{
            dropboxId: idNewArticle1,
            galleryLink: 'db.com/call1.jpg?dl=0',
            imgLink: 'db.com/call0.jpg?raw=1',
          }, {
            dropboxId: idNewArticle2,
            galleryLink: 'db.com/call3.jpg?dl=0',
            imgLink: 'db.com/call2.jpg?raw=1',
          }]

          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave)
          })
        })

        it('should call DropboxClient to get Fr TextFileStream', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(DropboxClient.getFrTextFileStream).to.have.been.calledWith(idNewArticle1)
            expect(DropboxClient.getFrTextFileStream).to.have.been.calledWith(idNewArticle2)
          })
        })

        it('should call DropboxClient to get En TextFileStream', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(DropboxClient.getEnTextFileStream).to.have.been.calledWith(idNewArticle1)
            expect(DropboxClient.getEnTextFileStream).to.have.been.calledWith(idNewArticle2)
          })
        })

        it('should call FileReader to read twice', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(FileReader.read).to.have.been.callCount(4)
          })
        })

        it('should save new title', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            const article = {
              frTitle: '59. Perdus autour du mont Gongga',
              enTitle: '59. Lost autour du mont Gongga',
            }
            expect(ArticleRepository.update).to.have.been.calledWith(article, idNewArticle1)
            expect(ArticleRepository.update).to.have.been.calledWith(article, idNewArticle2)
          })
        })

        it('should save photos', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(PhotoRepository.createPhotos).to.have.been.calledWith([{
              dropboxId: idNewArticle1,
              imgLink: 'db.com/call8.jpg?raw=1',
            }, {
              dropboxId: idNewArticle1,
              imgLink: 'db.com/call9.jpg?raw=1',
            }, {
              dropboxId: idNewArticle1,
              imgLink: 'db.com/call10.jpg?raw=1',
            }, {
              dropboxId: idNewArticle2,
              imgLink: 'db.com/call11.jpg?raw=1',
            }, {
              dropboxId: idNewArticle2,
              imgLink: 'db.com/call12.jpg?raw=1',
            }, {
              dropboxId: idNewArticle2,
              imgLink: 'db.com/call13.jpg?raw=1',
            }])
          })
        })

        it('should create shared link 2 times per photos + one for folder = 7 times two articles', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(DropboxClient.createSharedLink).to.have.been.callCount(14)
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/Img-0.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/5/Img-0.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/5')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/img1.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/47/img2.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/5/img1.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/5/img2.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_1808340.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_180839.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/IMG_2mggh.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_1808340.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/20150707_180839.jpg')
            expect(DropboxClient.createSharedLink).to.have.been.calledWith('/58/IMG_2mggh.jpg')
          })
        })

        it('should call chapter repository to create chapters of these articles', () => {
          // given
          const chaptersToSave = [
            {
              position: 1,
              dropboxId: idNewArticle1,
              imgLink: 'db.com/call4.jpg?raw=1',
              frText: 'Rassemblant trois valeureux compagnons :'
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

            },
            {
              position: 2,
              dropboxId: idNewArticle1,
              imgLink: 'db.com/call5.jpg?raw=1',
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
            {
              position: 1,
              dropboxId: idNewArticle2,
              imgLink: 'db.com/call6.jpg?raw=1',
              frText: 'Rassemblant trois valeureux compagnons :'
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
            },
            {
              position: 2,
              dropboxId: idNewArticle2,
              imgLink: 'db.com/call7.jpg?raw=1',
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
            }]

          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(ChapterRepository.createArticleChapters).to.have.been.calledWith(chaptersToSave)
          })
        })

        it('should send email with correct options', () => {
          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(mailJet.sendEmail).to.have.been.calledWith({
              from: 'contact-localhost@recontact.me',
              fromName: 'RecontactMe',
              to: ['abonne@recontact.me'],
              subject: '[RecontactMe] Il y a du nouveau sur le site !',
              template: '<p>Bonjour,</p><p>Il y a du nouveau du côté de <a href="https://fr.recontact.me/#">Recontact Me</a>.</p>'
                + '<p>2 nouveaux articles : '
                + '<a href="https://fr.recontact.me/articles/5">59. Perdus autour du mont Gongga</a>'
                + '<a href="https://fr.recontact.me/articles/47">59. Perdus autour du mont Gongga</a>'
                + '</p>',
            })
            expect(mailJet.sendEmail).to.have.been.calledWith({
              from: 'contact-localhost@recontact.me',
              fromName: 'RecontactMe',
              to: ['subscriber@recontact.me'],
              subject: '[RecontactMe] Some news on the website !',
              template: '<p>Hello,</p><p>There are some news on <a href="https://www.recontact.me/#">Recontact Me</a>.</p>'
                + '<p>2 new articles: '
                + '<a href="https://www.recontact.me/articles/5">59. Lost autour du mont Gongga</a>'
                + '<a href="https://www.recontact.me/articles/47">59. Lost autour du mont Gongga</a>'
                + '</p>',
            })
          })
        })

        it('should send email with correct options when there is one added article', () => {
          // given
          ArticleRepository.getAll.restore()

          const oldArticles = [savedArticle(idOldArticle), savedArticle(idNewArticle2)]
          sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles)

          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(mailJet.sendEmail).to.have.been.calledWith({
              from: 'contact-localhost@recontact.me',
              fromName: 'RecontactMe',
              to: ['abonne@recontact.me'],
              subject: '[RecontactMe] Il y a du nouveau sur le site !',
              template: '<p>Bonjour,</p><p>Il y a du nouveau du côté de <a href="https://fr.recontact.me/#">Recontact Me</a>.</p>'
                + '<p>Un nouvel article : '
                + '<a href="https://fr.recontact.me/articles/47">59. Perdus autour du mont Gongga</a>'
                + '</p>',
            })
            expect(mailJet.sendEmail).to.have.been.calledWith({
              from: 'contact-localhost@recontact.me',
              fromName: 'RecontactMe',
              to: ['subscriber@recontact.me'],
              subject: '[RecontactMe] Some news on the website !',
              template: '<p>Hello,</p><p>There are some news on <a href="https://www.recontact.me/#">Recontact Me</a>.</p>'
                + '<p>One new article: '
                + '<a href="https://www.recontact.me/articles/47">59. Lost autour du mont Gongga</a>'
                + '</p>',
            })
          })
        })

        it('should not send email when there are more than two added articles', () => {
          // given
          ArticleRepository.getAll.restore()

          const oldArticles = []
          sinon.stub(ArticleRepository, 'getAll').resolves(oldArticles)

          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(mailJet.sendEmail).not.to.have.been.called
          })
        })

        it('should return result', () => {
          // given
          const expectedResult = {
            addedArticles: [
              {
                dropboxId: idNewArticle2,
                enTitle: '59. Lost autour du mont Gongga',
                frTitle: '59. Perdus autour du mont Gongga',
                galleryPath: '/5',
                imgPath: '/5/Img-0.jpg',
              },
              {
                dropboxId: idNewArticle1,
                enTitle: '59. Lost autour du mont Gongga',
                frTitle: '59. Perdus autour du mont Gongga',
                galleryPath: '/47',
                imgPath: '/47/Img-0.jpg',
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
          }

          // when
          const promise = SynchroniseArticles.synchronizeArticles()

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
            dropboxId: idNewArticle1,
            galleryLink: '',
            imgLink: '',
          }, {
            dropboxId: idNewArticle2,
            galleryLink: '',
            imgLink: '',
          }]

          // when
          const promise = SynchroniseArticles.synchronizeArticles()

          // then
          return promise.then(() => {
            expect(ArticleRepository.create).to.have.been.calledWith(articlesToSave)
          })
        })
      })
    })
  })
})

