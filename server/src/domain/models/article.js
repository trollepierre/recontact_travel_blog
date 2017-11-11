module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    dropboxId: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    galleryLink: DataTypes.STRING,
    name: DataTypes.STRING,
  });

  return Article;
};
