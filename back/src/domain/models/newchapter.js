module.exports = (sequelize, DataTypes) => {
  const Newchapter = sequelize.define('Newchapter', {
    position: DataTypes.INTEGER,
    dropboxId: DataTypes.STRING,
    enTitle: DataTypes.STRING,
    frTitle: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    enText: DataTypes.TEXT,
    frText: DataTypes.TEXT,
  })

  return Newchapter
}

