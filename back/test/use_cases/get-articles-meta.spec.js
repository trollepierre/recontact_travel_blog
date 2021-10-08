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
    sinon.stub(ArticleRepository, 'getAll').returns(articles())
    sinon.stub(ChapterRepository, 'getChaptersOfArticle').returns(chapterOfArticle())
    sinon.stub(PhotoRepository, 'getPhotosOfArticle').returns(photosOfArticle())
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

  // it.only('should return result', async (done) => {
  //   // when
  //   const articlesMeta = await GetArticlesMeta.getAll()
  //
  //   console.log('here')
  //
  //   // then
  //   return articlesMeta.map(promise => {
  //     return Promise.resolve(promise).then(x => {
  //       console.log(x)
  //
  //       expect(x).to.eq('toto')
  //     })
  //   })
  //   // expect(articlesMeta).to.eqls([])
  // })
})

