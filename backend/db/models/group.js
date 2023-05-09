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
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId'});
      Group.hasMany(models.Venue, {foreignKey: 'groupId'});
      Group.belongsToMany(models.User, {through: models.Membership, foreignKey: "groupId", otherKey: "userId", as: 'Members'});
      Group.hasMany(models.Event, {foreignKey: 'groupId'});
      Group.belongsTo(models.User, {foreignKey: 'organizerId'});
      Group.hasMany(models.Membership, {foreignKey: 'groupId'});
    }
  }
  Group.init({
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        isLessThanSixtyOne(value) {
          let string = value.toString();
          if (string.length > 60) {
            throw new Error ('Name must be 60 characters or less')
          }
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      validate: {
        isMoreThanFifty(value) {
          let string = value.toString();
          if (string.length < 30) {
            throw new Error ('About must be 30 characters or more')
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      validate: {
        incorrectType(value) {
          let string = value.toString();
          if (string !== 'Online' && string !== 'In person') {
            throw new Error ('Type must be "Online" or "In person"')
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
