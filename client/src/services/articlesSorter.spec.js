import articlesSorter from './articlesSorter';

describe('Unit | services | articlesSorter', () => {
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
      expect(sortedArticles).toEqual([article('11'), article(3), article('2')]);
    });
  });
});
