'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.User, {through: models.Attendance, foreignKey: 'eventId', otherKey: 'userId', as: 'Attendees'});
      Event.hasMany(models.EventImage, {foreignKey: 'eventId'});
      Event.belongsTo(models.Group, {foreignKey: 'groupId'});
      Event.belongsTo(models.Venue, {foreignKey: 'venueId'});
      Event.hasMany(models.Attendance, {foreignKey: 'eventId'});
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.ENUM('Online', 'In person'),
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
