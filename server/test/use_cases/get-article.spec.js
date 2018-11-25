import { expect, sinon } from '../test-helper'
import GetArticle from '../../src/use_cases/get-article'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import ChapterRepository from '../../src/domain/repositories/chapter-repository'
import articleSaved from '../fixtures/articleSaved'
import chapterOfArticle from '../fixtures/chapterOfArticleSaved'
import chapterWithParagraphs from '../fixtures/chapterWithParagraphs'

describe('Unit | GetArticle | getrticle()', () => {
  const dropboxId = 8
  const article = articleSaved()
  const frTitle = 'Pierre au pays des'
  const enTitle = 'Peter in the country of'
  article.enTitle = enTitle
  article.frTitle = frTitle

  beforeEach(() => {
    sinon.stub(ChapterRepository, 'getChaptersOfArticle').resolves([chapterOfArticle()])
    sinon.stub(ArticleRepository, 'get').resolves(article)
  })

  afterEach(() => {
    ChapterRepository.getChaptersOfArticle.restore()
    ArticleRepository.get.restore()
  })

  it('should call ChapterRepository to getChaptersOfArticle articles', () => {
    // when
    GetArticle.getArticle(dropboxId)

    // then
    expect(ChapterRepository.getChaptersOfArticle).to.have.been.calledWith(dropboxId)
  })

  it('should call ArticleRepository to get article', () => {
    // when
    const promise = GetArticle.getArticle(dropboxId)

    // then
    return promise.then(() => {
      expect(ArticleRepository.get).to.have.been.calledWith(dropboxId)
    })
  })

  it('should return chapters with paragraphs', () => {
    // when
    const promise = GetArticle.getArticle(dropboxId)

    // then
    return promise.then((returnedArticle) => {
      const chapters = [chapterWithParagraphs()]
      expect(returnedArticle).to.deep.equal({ chapters, frTitle, enTitle })
    })
  })
})

