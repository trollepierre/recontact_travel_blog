const ArticlesSerializer = {

  serialize(metadatas) {
    return metadatas
      .filter(metadata => metadata['.tag'] === 'folder')
      .map(metadata => ({
        name: metadata.name,
        imgPath: `/${metadata.name}/img0.jpg`,
      }));
  },
};

module.exports = ArticlesSerializer;
