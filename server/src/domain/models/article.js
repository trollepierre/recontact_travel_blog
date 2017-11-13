module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    dropboxId: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    galleryLink: DataTypes.STRING,
    frTitle: DataTypes.STRING,
    enTitle: DataTypes.STRING,
  });

  return Article;
};
