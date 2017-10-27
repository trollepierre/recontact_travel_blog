module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    dropboxId: DataTypes.STRING,
    imgLink: DataTypes.STRING,
  });

  return Article;
};
