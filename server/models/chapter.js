'use strict';
module.exports = (sequelize, DataTypes) => {
  var Chapter = sequelize.define('Chapter', {
    title: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Chapter;
};