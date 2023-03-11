'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.groupImage, {foreignKey: 'groupId'});
      Group.hasMany(models.Venue, {foreignKey: 'groupId'});
      Group.belongsToMany(models.User, {through: models.Membership});
      Group.hasMany(models.Event, {foreignKey: 'groupId'});
      Group.belongsTo(models.User, {foreignKey: 'organizerId'}); //not sure how this works ask in class
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    type: DataTypes.ENUM('Online', 'In Person'),
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
