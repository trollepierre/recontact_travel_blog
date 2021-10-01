import { expect, sinon } from '../test-helper'
import GetArticlesError from '../../src/use_cases/get-articles-error'
import GetArticlesMeta from '../../src/use_cases/get-articles-meta'
import { dummyArticleMeta } from '../dummies/dummyArticle'
import { dummySimpleChapter } from '../dummies/dummyChapter'

describe('Unit | GetArticlesError | getAll()', () => {
  beforeEach(() => {
    sinon.stub(GetArticlesMeta, 'getAll').returns([dummyArticleMeta()])
  })

  afterEach(() => {
    GetArticlesMeta.getAll.restore()
  })

  it('should call GetArticlesMeta to getAll articles', async () => {
    // when
    await GetArticlesError.getAll()

    // then
    expect(GetArticlesMeta.getAll).to.have.been.calledWith()
  })

  it('should return empty table when no articles in error', async () => {
    // when
    const articlesError = await GetArticlesError.getAll()

    // then
    expect(articlesError).to.eqls([])
  })

  it('should return articles while missing image in chapter', async () => {
    // given
    GetArticlesMeta.getAll.restore()
    const brokenArticle = dummyArticleMeta({ brokenImgDropboxId: [dummySimpleChapter({ imgLink: '' })] })
    sinon.stub(GetArticlesMeta, 'getAll').returns([brokenArticle])

    // when
    const articlesError = await GetArticlesError.getAll()

    // then
    expect(articlesError).to.eqls([{ ...brokenArticle, error: ['missing images of chapter'] }])
  })

  it('should return articles while missing photos', async () => {
    // given
    GetArticlesMeta.getAll.restore()
    const brokenArticle = dummyArticleMeta({ photosCount: 0 })
    sinon.stub(GetArticlesMeta, 'getAll').returns([brokenArticle])

    // when
    const articlesError = await GetArticlesError.getAll()

    // then
    expect(articlesError).to.eqls([{ ...brokenArticle, error: ['missing photos gallery'] }])
  })

  it('should return articles while missing chapters', async () => {
    // given
    GetArticlesMeta.getAll.restore()
    const brokenArticle = dummyArticleMeta({ chaptersCount: 0 })
    sinon.stub(GetArticlesMeta, 'getAll').returns([brokenArticle])

    // when
    const articlesError = await GetArticlesError.getAll()

    // then
    expect(articlesError).to.eqls([{ ...brokenArticle, error: ['missing chapters'] }])
  })

  it('should not return articles while missing photos but photos off', async () => {
    // given
    GetArticlesMeta.getAll.restore()
    const brokenArticle = dummyArticleMeta({ photosCount: 0 })
    sinon.stub(GetArticlesMeta, 'getAll').returns([brokenArticle])

    // when
    const articlesError = await GetArticlesError.getAll({ photos: 'off' })

    // then
    expect(articlesError).to.eqls([])
  })

  it('should not return articles while missing image in chapter but images off', async () => {
    // given
    GetArticlesMeta.getAll.restore()
    const brokenArticle = dummyArticleMeta({ brokenImgDropboxId: [dummySimpleChapter({ imgLink: '' })] })
    sinon.stub(GetArticlesMeta, 'getAll').returns([brokenArticle])

    // when
    const articlesError = await GetArticlesError.getAll({ images: 'off' })

    // then
    expect(articlesError).to.eqls([])
  })
})

