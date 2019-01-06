module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
    datetime: DataTypes.STRING,
    author: DataTypes.STRING,
  })

  return Comment
}

