module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    dropboxId: DataTypes.STRING,
    title: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    text: DataTypes.TEXT,
  });

  return Chapter;
};

