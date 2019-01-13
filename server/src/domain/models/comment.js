module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    dropboxId: DataTypes.STRING,
    text: DataTypes.STRING,
    author: DataTypes.STRING,
  })

  return Comment
}

