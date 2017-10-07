
module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    title: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    text: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return Chapter;
};
