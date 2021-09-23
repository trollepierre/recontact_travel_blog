import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import chapterRepository from '../domain/repositories/chapter-repository'
import articleRepository from '../domain/repositories/article-repository'
import photoRepository from '../domain/repositories/photo-repository'
import DropboxClient from '../infrastructure/external_services/dropbox-client'
import FileReader from '../infrastructure/external_services/file-reader'

async function sync(dropboxId) {
  function _createPhotosOfArticlesInDatabase(dropboxFilesPath) {
    return getPhotosOfArticle(dropboxFilesPath)
      .then(photos => flatten(photos))
      .then(photos => photoRepository.createPhotos(photos))
  }

  function getPhotosOfArticle(dropboxFilesPath) {
    const paths = filterOnlyGalleryPhotos(dropboxFilesPath)
    return createPhotoOfArticle(paths, dropboxId)
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

  function createPhotoOfArticle(paths) {
    const allImgLinks = paths.reduce((promises, path) => {
      const imgLink = serializePhoto(path)
      promises.push(imgLink)
      return promises
    }, [])
    return Promise.all(allImgLinks)
  }

  function serializePhoto(path) {
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

  function _insertArticlesContentsInDatabase(dropboxFilesPath) {
    return _updateTitleAndExtractChaptersFromArticleContent(dropboxFilesPath)
      .then(allChapters => flatten(allChapters))
      .then(chapters => chapterRepository.createArticleChapters(chapters))
  }

  function _updateTitleAndExtractChaptersFromArticleContent(dropboxFilesPath) {
    return Promise.all([
      DropboxClient.getFrTextFileStream(dropboxId),
      DropboxClient.getEnTextFileStream(dropboxId),
    ])
      .then(files => Promise.all([
        FileReader.read(files[0]),
        FileReader.read(files[1]),
      ]))
      .then(articleContents => _serializeArticleContents(articleContents, dropboxFilesPath))
      .then(articleInfos => _updateArticleTitles(articleInfos))
      .then(articleInfos => _shareChapterImages(articleInfos))
      .then(({ chapters }) => chapters)
  }

  function _updateArticleTitles(articleInfos) {
    const { frTitle, enTitle } = articleInfos
    articleRepository.update({ frTitle, enTitle }, dropboxId)
    return articleInfos
  }

  function _serializeArticleContents(rawArticles, dropboxFilesPath) {
    const cuttedArticles = rawArticles.map(rawArticle => rawArticle
      .split('*')
      .map(row => row.trim()))

    const chapters = _generateChapters(cuttedArticles, dropboxFilesPath)

    return {
      frTitle: cuttedArticles[0][0],
      enTitle: cuttedArticles[1][0],
      chapters,
    }
  }

  function buildFullTitle(title, subtitle) {
    if ((title && subtitle) || (!title && !subtitle)) {
      return [title, subtitle].join(' - ').trim()
    }
    return [title, subtitle].join('')
  }

  function _generateChapters(cuttedArticles, dropboxFilesPath) {
    const frenchArticle = cuttedArticles[0]
    const englishArticle = cuttedArticles[1]
    const chapters = []
    for (let i = 1; i < frenchArticle.length / 3; i += 1) {
      const imgLink = dropboxFilesPath.filter(imgPath => imgPath.match(`[iI]mg-?${i}.jpg$`))[0]

      const frenchTitle = frenchArticle[(3 * i) - 2]
      const frenchSubtitle = frenchArticle[(3 * i) - 1]
      const englishTitle = englishArticle[(3 * i) - 2]
      const englishSubtitle = englishArticle[(3 * i) - 1]
      const frTitle = buildFullTitle(frenchTitle, frenchSubtitle)
      const enTitle = buildFullTitle(englishTitle, englishSubtitle)
      chapters[i - 1] = {
        position: i,
        dropboxId,
        frTitle,
        enTitle,
        imgLink,
        frText: frenchArticle[3 * i],
        enText: englishArticle[3 * i],
      }
    }
    return chapters
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
    console.log({ response })
    if (isEmpty(response)) {
      console.log('is empty')
      return ''
    }
    console.log('not empty')

    const split = response.url.replace(/....$/, '').split('/s/')
    return `${split[0]}/s/raw/${split[1].split('?')[0]}`
  }

  function _getGalleryUrl(response) {
    return isEmpty(response) ? '' : response.url
  }

  await Promise.all([
    articleRepository.deleteByDropboxId(dropboxId),
    chapterRepository.deleteChaptersOfArticle(dropboxId),
    photoRepository.deletePhotosOfArticle(dropboxId),
  ])
  const dropboxFilesPath = await DropboxClient.getFilesFolderPaths(dropboxId)
  const imageZero = dropboxFilesPath
    .filter(path => path.match('[Ii]mg-?0.jpg$'))[0]
  const report = {
    addedArticles: [
      {
        dropboxId,
        imgPath: imageZero,
        galleryPath: `/${dropboxId}`,
      },
    ],
  }
  await _createArticlesInDatabase(report)
  await _insertArticlesContentsInDatabase(dropboxFilesPath)
  await _createPhotosOfArticlesInDatabase(dropboxFilesPath)
  return report
}

export default {
  sync,
}
