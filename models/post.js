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
      Post.belongsTo(models.User);
      Post.belongsTo(models.Section);

      Post.hasMany(models.Comment);
    }
  };
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    body: {
      type: DataTypes.STRING(2000),
      allowNull: false
    },
    visits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false  
    },
    shits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false  
    }
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};