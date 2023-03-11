'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'www.example.com/img.png',
        preview: true,
      },
      {
        eventId: 1,
        url: 'www.example.com/img.png1',
        preview: false,
      },
      {
        eventId: 2,
        url: 'www.example.com/img.png2',
        preview: false,
      },
      {
        eventId: 2,
        url: 'www.example.com/img.png3',
        preview: true,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: {[Op.in]: [1 , 2]}
    }, {});
  }
};
