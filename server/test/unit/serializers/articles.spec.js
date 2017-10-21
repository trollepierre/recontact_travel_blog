const { expect } = require('../../test-helper');
const serializer = require('../../../src/serializers/articles');
const dropboxFilesListFolder = require('../fixtures/dropboxFilesListFolder');

describe('Unit | Serializer | articles', () => {
  it('should return an array of Article objects serialized from metadatas', () => {
    // when
    const articles = serializer.serialize(dropboxFilesListFolder);

    // then
    const expectedArticles = [
      {
        dropboxId: '58',
        imgPath: '/58/img0.jpg',
      },
      {
        dropboxId: '59',
        imgPath: '/59/img0.jpg',
      }];
    expect(articles).to.deep.equal(expectedArticles);
  });
});

