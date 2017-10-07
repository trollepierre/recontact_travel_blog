
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    name: DataTypes.STRING,
    imgLink: DataTypes.STRING,
  }, {
    classMethods: {
      associate(/* models */) {
        // associations can be defined here
      },
    },
  });

  Article.associate = models => Article.hasMany(models.Chapter);

  return Article;
};
