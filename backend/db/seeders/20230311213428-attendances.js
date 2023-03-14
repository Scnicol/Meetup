'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        eventId: 1,
        status: 'Member',
      },
      {
        userId: 2,
        eventId: 2,
        status: 'Waitlist',
      },
      {
        userId: 3,
        eventId: 1,
        status: 'Pending',
      },
      {
        userId: 3,
        eventId: 2,
        status: 'Member',
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: {[Op.in]: ['Member', 'Waitlist', 'Pending']}
    }, {});
  }
};
