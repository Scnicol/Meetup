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
        status: 'attending',
      },
      {
        userId: 2,
        eventId: 2,
        status: 'waitlist',
      },
      {
        userId: 3,
        eventId: 1,
        status: 'pending',
      },
      {
        userId: 3,
        eventId: 2,
        status: 'attending',
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
