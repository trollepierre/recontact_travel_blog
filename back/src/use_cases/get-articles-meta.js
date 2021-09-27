import articleRepository from '../domain/repositories/article-repository'
import chapterRepository from '../domain/repositories/chapter-repository'
import photoRepository from '../domain/repositories/photo-repository'

function getAll() {
  return articleRepository.getAll()
    .map(({ dropboxId, frTitle, enTitle }) => Promise.all([
      chapterRepository.getChaptersOfArticle(dropboxId),
      photoRepository.getPhotosOfArticle(dropboxId),
    ]).then(([chapters, photos]) => ({
      dropboxId,
      frTitle,
      enTitle,
      chaptersCount: chapters.length,
      brokenImgDropboxId: chapters.filter(chapter => chapter.imgLink === ''),
      photosCount: photos.length,
    })))
}

export default {
  getAll,
}
