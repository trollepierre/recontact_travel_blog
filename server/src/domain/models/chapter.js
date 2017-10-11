module.exports = (sequelize, DataTypes) => {
  const Chapter = sequelize.define('Chapter', {
    title: DataTypes.STRING,
    imgLink: DataTypes.STRING,
    text: DataTypes.TEXT,
  }, {
    classMethods: {
      associate(/* models */) {
        // associations can be defined here
      },
    },
  });

  // task.js
  // ...
  Chapter.associate = (models) => {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Chapter.belongsTo(models.Article);
    Chapter.belongsTo(models.Article, {
      // onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Chapter;
};

