'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        address: 'Salt and Straw',
        city: 'San Francisco',
        state: 'CA',
        lat: 75.7,
        lng: 35.5,
      },
      {
        address: 'Home',
        city: 'Where ever you live',
        state: 'Where ever you live',
        lat: 1.1,
        lng: 1.1,
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: {[Op.in]: ['Home', 'Salt and Straw']}
    }, {});
  }
};
