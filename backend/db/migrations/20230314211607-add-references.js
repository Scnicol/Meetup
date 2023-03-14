'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    //adding the organizerId to the Groups table
    await queryInterface.addColumn('Groups', 'organizerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Users'},
    });
    //adding the userId to the Memberships table
    await queryInterface.addColumn('Memberships', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Users'},
      onDelete: 'cascade',
    });
    //adding the groupId to the Memberships table
    await queryInterface.addColumn('Memberships', 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
      onDelete: 'cascade',
    });
    //adding the groupId to the Venues table
    await queryInterface.addColumn('Venues', 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
    });
    //adding the groupId to the Events table
    await queryInterface.addColumn('Events', 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
    });
    //adding the venueId to the Events table
    await queryInterface.addColumn('Events', 'venueId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Venues'},
    });
    //adding the eventId to the EventImages table
    await queryInterface.addColumn('EventImages', 'eventId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Events'},
    });
    //adding userId to the Attendances table
    await queryInterface.addColumn('Attendances', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Users'},
      onDelete: 'cascade',
    });
    //adding eventId to the Attendances table
    await queryInterface.addColumn('Attendances', 'eventId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Events'},
      onDelete: 'cascade',
    });
    //adding groupId to the GroupImages table
    await queryInterface.addColumn('GroupImages', 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
    }, options);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Groups', 'organizerId');
    await queryInterface.removeColumn('Memberships', 'userId');
    await queryInterface.removeColumn('Memberships', 'groupId');
    await queryInterface.removeColumn('Venues', 'groupId');
    await queryInterface.removeColumn('Events', 'groupId');
    await queryInterface.removeColumn('Events', 'venueId');
    await queryInterface.removeColumn('EventImages', 'eventId');
    await queryInterface.removeColumn('Attendances', 'userId');
    await queryInterface.removeColumn('Attendances', 'eventId');
    await queryInterface.removeColumn('GroupImages', 'groupId');
  }
};
