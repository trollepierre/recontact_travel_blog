module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    dropboxId: DataTypes.STRING,
    enTitle: DataTypes.STRING,
    frTitle: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    enText: DataTypes.TEXT,
    frText: DataTypes.TEXT,
  });

  return Chapter;
};

