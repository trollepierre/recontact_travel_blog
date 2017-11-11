module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('Photo', {
    dropboxId: DataTypes.STRING,
    imgLink: DataTypes.STRING,
  });

  return Photo;
};

