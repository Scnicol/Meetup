'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Cereal Killers',
        about: 'Do you love killing cereal? hear it scream as you chomp on it? well look no further!',
        type: 'In Person',
        private: true,
        city:'Albany',
        state: 'CA',
      },
      {
        organizerId: 2,
        name: 'Icecream Dicecream',
        about: 'Love games?? Love Icecream? come join us!',
        type: 'Online',
        private: false,
        city:'Berkeley',
        state: 'CA',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Cereal Killers', 'Icecream Dicecream'] }
    }, {});
  }
};
