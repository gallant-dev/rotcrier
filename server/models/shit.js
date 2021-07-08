'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shit.belongsTo(models.User)
      Shit.belongsTo(models.Post)
      Shit.belongsTo(models.Comment)
    }
  };
  Shit.init({
  }, {
    sequelize,
    tableName: 'shits',
    modelName: 'Shit',
  });
  return Shit;
};