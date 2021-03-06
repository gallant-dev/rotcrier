'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User)
      Comment.belongsTo(models.Post)
      Comment.belongsTo(models.Comment, {as: 'parent', foreignKey: 'CommentId'})

      Comment.hasMany(models.Comment, {as: 'Comments', foreignKey: 'CommentId'})
      Comment.hasMany(models.Shit)
    }
  };
  Comment.init({
    body: {
      type: DataTypes.STRING(2000),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'comments',
    modelName: 'Comment',
  });
  return Comment;
};