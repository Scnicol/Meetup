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
        status: 'Member',
      },
      {
        status: 'Waitlist',
      },
      {
        status: 'Pending',
      },
      {
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
