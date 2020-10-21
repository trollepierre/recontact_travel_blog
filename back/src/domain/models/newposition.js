module.exports = (sequelize, DataTypes) => {
  const Newposition = sequelize.define('Newposition', {
    place: DataTypes.STRING,
    time: DataTypes.STRING,
    placeEn: DataTypes.STRING,
    timeEn: DataTypes.STRING,
  })

  return Newposition
}

