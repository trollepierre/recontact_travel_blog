import articlesSorter from '@/services/articlesSorter';

describe('Unit | services | articlesSorter', () => {
  beforeEach(() => {
  });

  afterEach(() => {
  });

  describe('#sortByDropboxId', () => {
    it('should return sortByDropboxId articles', () => {
      // given
      const article = (dropboxId = 59) => ({
        dropboxId,
        frTitle: 'Le titre',
        enTitle: 'The title',
      });
      const articles = [article('2'), article('11'), article(3)];

      // when
      const sortedArticles = articlesSorter.sortByDropboxId(articles);

      // then
      expect(sortedArticles).to.deep.equal([article('11'), article(3), article('2')]);
    });
  });
});
