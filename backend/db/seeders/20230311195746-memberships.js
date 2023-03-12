'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'co-host',
      },
      {
        userId: 2,
        groupId: 2,
        status: 'member',
      },
      {
        userId: 3,
        groupId: 1,
        status: 'pending',
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: {[Op.in]: ['co-host', 'member', 'pending']}
    }, {});
  }
};
