'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: 'http://www.example.com/img1.png',
        preview: true,
      },
      {
        groupId: 1,
        url: 'http://www.example.com/img2.png',
        preview: false,
      },
      {
        groupId: 1,
        url: 'http://www.example.com/img3.png',
        preview: true,
      },
      {
        groupId: 2,
        url: 'http://www.example.com/img4.png',
        preview: false,
      },
      {
        groupId: 2,
        url: 'http://www.example.com/img5.png',
        preview: true,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: {[Op.in]: [true, false]}
    }, {});
  }
};
