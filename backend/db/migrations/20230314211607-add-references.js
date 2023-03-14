'use strict';

let options = {};
if (ProcessingInstruction.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    //adding the organizerId to the Groups table
    options.tableName = "Groups";
    await queryInterface.addColumn(options, 'organizerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Users'},
    });
    //adding the userId to the Memberships table
    options.tableName = "Memberships";
    await queryInterface.addColumn(options, 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Users'},
      onDelete: 'cascade',
    });
    //adding the groupId to the Memberships table
    options.tableName = "Memberships";
    await queryInterface.addColumn(options, 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
      onDelete: 'cascade',
    });
    //adding the groupId to the Venues table
    options.tableName = "Venues";
    await queryInterface.addColumn(options, 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
    });
    //adding the groupId to the Events table
    options.tableName = "Events";
    await queryInterface.addColumn(options, 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
    });
    //adding the venueId to the Events table
    options.tableName = "Events";
    await queryInterface.addColumn(options, 'venueId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Venues'},
    });
    //adding the eventId to the EventImages table
    options.tableName = "EventImages";
    await queryInterface.addColumn(options, 'eventId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Events'},
    });
    //adding userId to the Attendances table
    options.tableName = "Attendances";
    await queryInterface.addColumn(options, 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Users'},
      onDelete: 'cascade',
    });
    //adding eventId to the Attendances table
    options.tableName = "Attendances";
    await queryInterface.addColumn(options, 'eventId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Events'},
      onDelete: 'cascade',
    });
    //adding groupId to the GroupImages table
    options.tableName = "GroupImages";
    await queryInterface.addColumn(options, 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
    }, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.removeColumn(options, 'organizerId');
    options.tableName = "Memberships";
    await queryInterface.removeColumn(options, 'userId');
    options.tableName = "Memberships";
    await queryInterface.removeColumn(options, 'groupId');
    options.tableName = "Venues'";
    await queryInterface.removeColumn(options, 'groupId');
    options.tableName = "Events";
    await queryInterface.removeColumn(options, 'groupId');
    options.tableName = "Events";
    await queryInterface.removeColumn(options, 'venueId');
    options.tableName = "EventImages";
    await queryInterface.removeColumn(options, 'eventId');
    options.tableName = "Attendances";
    await queryInterface.removeColumn(options, 'userId');
    options.tableName = "Attendances";
    await queryInterface.removeColumn(options, 'eventId');
    options.tableName = "GroupImages";
    await queryInterface.removeColumn(options, 'groupId');
  }
};
