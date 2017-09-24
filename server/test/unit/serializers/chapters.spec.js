const { expect } = require('../../test-helper');
const serializer = require('../../../src/serializers/chapters');
const articleFr = require('../fixtures/articleFr');
const serializedChapters = require('../fixtures/serializedChapters');

describe('Unit | Serializer | chapters', () => {
  it('should return an array of Article objects serialized from metadatas', () => {
    // when
    const chapters = serializer.serialize(articleFr);

    // then
    expect(chapters).to.deep.equal(serializedChapters);
  });
});

