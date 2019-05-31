import { flatten, isEmpty } from 'lodash'
import DropboxClient from '../infrastructure/external_services/dropbox-client'
import FileReader from '../infrastructure/external_services/file-reader'
import articleRepository from '../domain/repositories/article-repository'
import articlesChangedEmailEnTemplate from '../infrastructure/mailing/articles-changed-email-en-template'
import articlesChangedEmailFrTemplate from '../infrastructure/mailing/articles-changed-email-fr-template'
import chapterRepository from '../domain/repositories/chapter-repository'
import env from '../infrastructure/env/env'
import mailJet from '../infrastructure/mailing/mailjet'
import photoRepository from '../domain/repositories/photo-repository'
import subscriptionRepository from '../domain/repositories/subscription-repository'
import { _serializeArticleContents } from './services/serialize-article-contents'

async function synchronizeArticles() {
  try {
    const dropboxFiles = await DropboxClient.getAllDropboxFoldersMetadatas()
    const freshArticles = _serializeArticles(dropboxFiles)
    const report = await _compareDropboxAndDatabaseArticles(freshArticles)
    const articlesToReport = await _ifArticlesChangesThenUpdateArticlesInDatabase(report, dropboxFiles)
    return _ifArticlesChangedThenSendEmailToRecipients(articlesToReport)
  } catch (error) {
    await _sendMailToSupport(error)
    throw error
  }
}

function _serializeArticles(metadatas) {
  const imageZeros = metadatas
    .map(fileMetadata => fileMetadata.path_display)
    .filter(path => path.match('[Ii]mg-?0.jpg$'))
  return metadatas
    .filter(metadata => metadata['.tag'] === 'folder')
    .map(({ name }) => {
      const imgPath = imageZeros.filter(img => img.match(`^/${name}`))[0]
      return {
        dropboxId: name,
        imgPath,
        galleryPath: `/${name}`,
      }
    })
}

function _compareDropboxAndDatabaseArticles(freshArticles) {
  return articleRepository.getAll()
    .then(oldArticles => {
      const addedArticles = freshArticles.reduce((accumulatedArticles, freshArticle) => {
        const matchedArticles = oldArticles.filter(({ dropboxId }) => dropboxId === freshArticle.dropboxId)
        if (matchedArticles.length === 0) {
          accumulatedArticles.push(freshArticle)
        }
        return accumulatedArticles
      }, [])
      const hasChanges = !isEmpty(addedArticles)
      return { addedArticles, hasChanges }
    })
}

function _ifArticlesChangedThenSendEmailToRecipients(report) {
  const result = report
  if (report.hasChanges && report.addedArticles.length < 3) {
    return subscriptionRepository.getAll()
      .then(subscriptions => {
        result.receivers = subscriptions
        return result
      })
      .then(form => _sendArticlesChangedEmail(form))
      .then(() => result)
  }
  return report
}

function _sendArticlesChangedEmail(form) {
  const { receivers } = form
  const templateFr = articlesChangedEmailFrTemplate.compile(form)
  const templateEn = articlesChangedEmailEnTemplate.compile(form)

  const optionsFr = {
    from: env('MAIL_FROM'),
    fromName: 'RecontactMe',
    to: receivers.filter(({ lang }) => lang === 'fr').map(({ email }) => email),
    subject: '[RecontactMe] Il y a du nouveau sur le site !',
    template: templateFr,
  }
  const optionsEn = {
    from: env('MAIL_FROM'),
    fromName: 'RecontactMe',
    to: receivers.filter(({ lang }) => lang !== 'fr').map(({ email }) => email),
    subject: '[RecontactMe] Some news on the website !',
    template: templateEn,
  }
  return Promise.all([mailJet.sendEmail(optionsFr), mailJet.sendEmail(optionsEn)])
}

function _sendMailToSupport(error) {
  const optionsFr = {
    from: env('MAIL_FROM'),
    fromName: 'RecontactMe',
    to: [env('MAIL_SUPPORT')],
    subject: '[RecontactMe] Il y a des erreurs sur le site !',
    template: `<p>${JSON.stringify(error)}</p>`,
  }
  return mailJet.sendEmail(optionsFr)
}

function _ifArticlesChangesThenUpdateArticlesInDatabase(report, dropboxFiles) {
  if (report.hasChanges) {
    return _createArticlesInDatabase(report)
      .then(() => _insertArticlesContentsInDatabase(report, dropboxFiles))
      .then(articlesToReport => _createPhotosOfArticlesInDatabase(articlesToReport))
  }
  return report
}

function _createPhotosOfArticlesInDatabase(report) {
  const allPhotosOfAllArticles = report.addedArticles.reduce((promises, article) => {
    const photosOfArticle = getPhotosOfArticle(article)
    promises.push(photosOfArticle)
    return promises
  }, [])
  return Promise.all(allPhotosOfAllArticles)
    .then(photos => flatten(photos))
    .then(photos => photoRepository.createPhotos(photos))
    .then(() => report)
}

function getPhotosOfArticle({ dropboxId }) {
  return DropboxClient.getFilesFolderPaths(dropboxId)
    .then(paths => filterOnlyGalleryPhotos(paths))
    .then(paths => createPhotoOfArticle(paths, dropboxId))
}

function filterOnlyGalleryPhotos(paths) {
  const photosPaths = paths.filter(path => {
    const extension = path.split('.').pop()
    return extension === 'jpg' || extension === 'jpeg' || extension === 'png'
  })
  return photosPaths.filter(path => {
    const shortName = path.split('/').pop().substring(0, 3)
    return !shortName.match('[iI]mg')
  })
}

function createPhotoOfArticle(paths, dropboxId) {
  const allImgLinks = paths.reduce((promises, path) => {
    const imgLink = serializePhoto(path, dropboxId)
    promises.push(imgLink)
    return promises
  }, [])
  return Promise.all(allImgLinks)
}

function serializePhoto(path, dropboxId) {
  return DropboxClient.createSharedLink(path)
    .then(response => ({
      imgLink: _transformToImgLink(response),
      dropboxId,
    }))
}

function _createArticlesInDatabase({ addedArticles }) {
  return _shareImagesZeros(addedArticles)
    .then(articles => articleRepository.create(articles))
}

function _shareImagesZeros(articles) {
  const articlesWithAll = articles.reduce((promises, article) => {
    const articleWithAll = _shareImageZero(article)
    promises.push(articleWithAll)
    return promises
  }, [])
  return Promise.all(articlesWithAll)
}

function _shareImageZero(article) {
  return Promise.all([
    DropboxClient.createSharedLink(article.imgPath),
    DropboxClient.createSharedLink(article.galleryPath),
  ])
    .then(responses => ({
      dropboxId: article.dropboxId,
      imgLink: _transformToImgLink(responses[0]),
      galleryLink: _getGalleryUrl(responses[1]),
    }))
}

function _insertTitleInReport(report, articlesContents) {
  const result = report
  result.addedArticles.map(article => {
    const articleWithTitle = article
    const { frTitle, enTitle } = articlesContents.find(({ dropboxId }) => dropboxId === article.dropboxId)
    articleWithTitle.frTitle = frTitle
    articleWithTitle.enTitle = enTitle
    return articleWithTitle
  })
  return result
}

function _insertArticlesContentsInDatabase(report, dropboxFiles) {
  let result
  const allChaptersToSave = report.addedArticles.reduce((promises, article) => {
    const chaptersToSave = _updateTitleAndExtractChaptersFromArticleContent(article, dropboxFiles)
    promises.push(chaptersToSave)
    return promises
  }, [])
  return Promise.all(allChaptersToSave)
    .then(articlesContents => {
      result = _insertTitleInReport(report, articlesContents)
      return articlesContents.map(({ chapters }) => chapters)
    })
    .then(allChapters => flatten(allChapters))
    .then(chapterRepository.createArticleChapters)
    .then(() => result)
}

function _updateTitleAndExtractChaptersFromArticleContent(article, dropboxFiles) {
  const { dropboxId } = article
  return Promise.all([
    DropboxClient.getFrTextFileStream(dropboxId),
    DropboxClient.getEnTextFileStream(dropboxId),
  ])
    .then(files => Promise.all([
      FileReader.read(files[0]),
      FileReader.read(files[1]),
    ]))
    .then(articleContents => _serializeArticleContents(articleContents, dropboxId, dropboxFiles))
    .then(articleInfos => _updateArticleTitles(articleInfos, dropboxId))
    .then(_shareChapterImages)
}

function _updateArticleTitles(articleInfos, dropboxId) {
  const { frTitle, enTitle } = articleInfos
  articleRepository.update({ frTitle, enTitle }, dropboxId)
  return articleInfos
}

function _shareChapterImages(articleInfos) {
  const chaptersWithSharableLink = articleInfos.chapters.reduce((promises, chapter) => {
    if (isEmpty(chapter.imgLink)) {
      console.error('Problème avec les données fournies dans cet article : ')
      console.error(chapter)
      return promises
    }
    const promise = _shareChapterImage(chapter.imgLink)
    promises.push(promise)
    return promises
  }, [])
  return Promise.all(chaptersWithSharableLink)
    .then(imgLinks => {
      const newArticleInfos = articleInfos
      for (let i = 0; i < imgLinks.length; i += 1) {
        newArticleInfos.chapters[i].imgLink = imgLinks[i]
      }
      return newArticleInfos
    })
}

function _shareChapterImage(imgLink) {
  return DropboxClient.createSharedLink(imgLink)
    .then(_transformToImgLink)
}

function _transformToImgLink(response) {
  return isEmpty(response) ? '' : response.url.replace(/....$/, 'raw=1')
}

function _getGalleryUrl(response) {
  return isEmpty(response) ? '' : response.url
}
export default {
  synchronizeArticles,
}
