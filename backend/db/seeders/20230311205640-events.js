'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: 'Krushing Kellogs',
        description: 'Come meet up while we kill many different types of Kellogs cereal!',
        type: 'In Person',
        capacity: 12,
        price: 5,
        startDate: (2023, 8, 14),
        endDate: (2023, 8, 14),
      },
      {
        groupId: 2,
        venueId: 2,
        name: 'IScream at gaming',
        description: 'Scary game night! Pick out your favorite icecream place and log on with us as we scream with our icecream!!',
        type: 'Online',
        capacity: 8,
        price: 0,
        startDate: (2023, 9, 15),
        endDate: (2023, 9, 15),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Krushing Kellogs', 'IScream at gaming'] }
    }, {});
  }
};