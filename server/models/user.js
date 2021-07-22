'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Section, { 
        through: 'Memberships'
      })

      User.hasMany(models.Section)
      User.hasMany(models.Comment)
      User.hasMany(models.Shit, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  User.init({
    displayName: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};