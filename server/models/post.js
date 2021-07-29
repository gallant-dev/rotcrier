'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.belongsTo(models.Section)

      Post.hasMany(models.Comment)
      Post.hasMany(models.Shit)
    }
  };
  Post.init({
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    body: {
      type: DataTypes.TEXT(2000),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};