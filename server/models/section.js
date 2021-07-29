'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Section.hasMany(models.Post)
      Section.belongsToMany(models.User, { 
        through: 'Memberships',
        as: 'members'
      })
    }
  };
  Section.init({
    title: { 
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    description: { 
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'sections',
    modelName: 'Section',
  });
  return Section;
};