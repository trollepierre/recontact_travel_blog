import { expect, sinon } from '../test-helper'
import GetArticlesMeta from '../../src/use_cases/get-articles-meta'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import ChapterRepository from '../../src/domain/repositories/chapter-repository'
import PhotoRepository from '../../src/domain/repositories/photo-repository'
import chapterOfArticle from '../fixtures/chapterOfArticleSaved'
import photosOfArticle from '../fixtures/photoOfArticleSaved'
import articles from '../fixtures/articlesWithSharedLink'

describe('Unit | GetArticlesMeta | getAll()', () => {
  beforeEach(() => {
    sinon.stub(ArticleRepository, 'getAll').resolves(articles())
    sinon.stub(ChapterRepository, 'getChaptersOfArticle').resolves([chapterOfArticle()])
    sinon.stub(PhotoRepository, 'getPhotosOfArticle').resolves([photosOfArticle()])
  })

  afterEach(() => {
    ArticleRepository.getAll.restore()
    ChapterRepository.getChaptersOfArticle.restore()
    PhotoRepository.getPhotosOfArticle.restore()
  })

  it('should call ArticleRepository to getAll articles', async () => {
    // when
    await GetArticlesMeta.getAll()

    // then
    expect(ArticleRepository.getAll).to.have.been.calledWith()
    expect(ChapterRepository.getChaptersOfArticle).to.have.been.callCount(3)
    expect(PhotoRepository.getPhotosOfArticle).to.have.been.callCount(3)
  })

  it('should return the counts of each article', async () => {
    // when
    const articlesMeta = await GetArticlesMeta.getAll()

    // then
    // the stubs resolve promises rather than returning arrays: `.map` on a
    // promise was bluebird's, and stubbing a plain array hid that from the suite
    expect(articlesMeta).to.have.lengthOf(3)
    expect(articlesMeta[0]).to.include.keys('dropboxId', 'chaptersCount', 'photosCount')
  })
})

