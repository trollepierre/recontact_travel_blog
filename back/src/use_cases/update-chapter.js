import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import chapterRepository from '../domain/repositories/chapter-repository'
import DropboxClient from '../infrastructure/external_services/dropbox-client'
import FileReader from '../infrastructure/external_services/file-reader'

async function sync({ dropboxId, chapterPosition }) {
  function _updateTitleAndExtractChaptersFromArticleContent(dropboxFilesPath) {
    return Promise.all([
      DropboxClient.getFrTextFileStream(dropboxId),
      DropboxClient.getEnTextFileStream(dropboxId),
    ])
      .then(files => Promise.all([
        FileReader.read(files[0]),
        FileReader.read(files[1]),
      ]))
      .then(articleContents => _serializeArticleContentsAndReturnOneChapter(articleContents, dropboxFilesPath))
      .then(articleInfos => _shareChapterImages(articleInfos))
      .then(({ chapters }) => chapters)
  }

  function _serializeArticleContentsAndReturnOneChapter(rawArticles, dropboxFilesPath) {
    const cuttedArticles = rawArticles.map(rawArticle => rawArticle
      .split('*')
      .map(row => row.trim()))

    const chapters = _generateOnlyOneChapter(cuttedArticles, dropboxFilesPath)

    return {
      chapters,
    }
  }

  function buildFullTitle(title, subtitle) {
    if ((title && subtitle) || (!title && !subtitle)) {
      return [title, subtitle].join(' - ').trim()
    }
    return [title, subtitle].join('')
  }

  function _generateOnlyOneChapter(cuttedArticles, dropboxFilesPath) {
    const frenchArticle = cuttedArticles[0]
    const englishArticle = cuttedArticles[1]
    const chapters = []

    const i = chapterPosition

    const imgLink = dropboxFilesPath.filter(imgPath => imgPath.match(`[iI]mg-?${i}.jpg$`))[0]

    const frenchTitle = frenchArticle[(3 * i) - 2]
    const frenchSubtitle = frenchArticle[(3 * i) - 1]
    const englishTitle = englishArticle[(3 * i) - 2]
    const englishSubtitle = englishArticle[(3 * i) - 1]
    const frTitle = buildFullTitle(frenchTitle, frenchSubtitle)
    const enTitle = buildFullTitle(englishTitle, englishSubtitle)
    chapters[0] = {
      position: i,
      dropboxId,
      frTitle,
      enTitle,
      imgLink,
      frText: frenchArticle[3 * i],
      enText: englishArticle[3 * i],
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
    if (isEmpty(response)) {
      console.error('img link is empty again')
      return ''
    }
    const split = response.url.replace(/....$/, '').split('/s/')
    return `${split[0]}/s/raw/${split[1].split('?')[0]}`
  }

  await chapterRepository.deleteChapterOfArticle(dropboxId, chapterPosition) // ok

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
  await _updateTitleAndExtractChaptersFromArticleContent(dropboxFilesPath)
    .then(allChapters => flatten(allChapters))
    .then(chapters => chapterRepository.createArticleChapters(chapters))
  return report
}

export default {
  sync,
}
