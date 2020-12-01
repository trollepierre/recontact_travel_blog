import { expect, sinon } from '../test-helper'
import GetArticle from '../../src/use_cases/get-article'
import ArticleRepository from '../../src/domain/repositories/article-repository'
import ChapterRepository from '../../src/domain/repositories/chapter-repository'
import articleSaved from '../fixtures/articleSaved'
import chapterOfArticle from '../fixtures/chapterOfArticleSaved'
import chapterWithParagraphs from '../fixtures/chapterWithParagraphs'

describe('Unit | GetArticle | getArticle()', () => {
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
    return promise.then(returnedArticle => {
      const chapters = [chapterWithParagraphs({ frText: ['Un grand merci à toi Pierre. Sans ta motivation, ta persévérance, ton sacrifice physique pour porter notre fardeau aux moments difficiles, il est fort probable que nous ne puissions jamais franchir ce maudit col. C\'est sans doute la randonnée la plus exigeante de ma vie mais au combien stimulante et mémorable\xa0! C\'est en mettant le corps et l\'esprit à l\'épreuve que l\'on prend conscience des forces cachées en nous. Une belle aventure entre amis, des paysages à couper le souffle, un silence rare et appréciable en Chine, un sentiment d\'humilité face à la puissance et la beauté des chaines de montagnes de l\'Himalaya, la générosité et hospitalité du peuple tibétain, et un mal de tête persistant qui est quand même sacrement perturbant, voici ce que je retiendrai de ce trek de folie en compagnie d\'un baroudeur de première classe et d\'une "touriste" allemande courageuse jusqu\'au bout.'] })]
      expect(returnedArticle).to.deep.equal({ chapters, frTitle, enTitle })
    })
  })
})

