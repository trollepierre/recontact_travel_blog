import articleRepository from '../domain/repositories/article-repository'
import chapterRepository from '../domain/repositories/chapter-repository'
import photoRepository from '../domain/repositories/photo-repository'

const countArticleContent = async ({ dropboxId, frTitle, enTitle }) => {
  const [chapters, photos] = await Promise.all([
    chapterRepository.getChaptersOfArticle(dropboxId),
    photoRepository.getPhotosOfArticle(dropboxId),
  ])
  return {
    dropboxId,
    frTitle,
    enTitle,
    chaptersCount: chapters.length,
    brokenImgDropboxId: chapters.filter(chapter => chapter.imgLink === ''),
    photosCount: photos.length,
  }
}

// `.map` on a promise was bluebird, which sequelize 5 handed us; sequelize 6
// returns native promises and has no such method
async function getAll() {
  const articles = await articleRepository.getAll()
  return Promise.all(articles.map(countArticleContent))
}

export default {
  getAll,
}
