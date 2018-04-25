module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    place: DataTypes.STRING,
    time: DataTypes.STRING,
  });

  return Position;
};

