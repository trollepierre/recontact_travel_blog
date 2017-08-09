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
        name: '58',
        imgLink: '/58/img0.jpg',
      },
      {
        name: '59',
        imgLink: '/59/img0.jpg',
      }];
    expect(articles).to.deep.equal(expectedArticles);
  });
});

