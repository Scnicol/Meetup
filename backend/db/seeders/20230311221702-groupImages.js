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
        url: 'https://www.toxel.com/wp-content/uploads/2022/06/cerealkillerspoon03.jpg',
        preview: true,
      },
      {
        groupId: 1,
        url: 'https://berniegourley.files.wordpress.com/2014/10/cereal-killer.jpg',
        preview: false,
      },
      {
        groupId: 1,
        url: 'https://images.metroparent.com/wp-content/uploads/2020/12/Which-Kids-Cereals-Have-the-Most-Sugar.jpg',
        preview: false,
      },
      {
        groupId: 2,
        url: 'https://static.toiimg.com/thumb/67884361.cms?width=680&height=512&imgsize=956165',
        preview: false,
      },
      {
        groupId: 2,
        url: 'https://www.cleveland.com/resizer/pvkXQnd-VNn6YjXlzq9xSQMsdl0=/1280x0/smart/advancelocal-adapter-image-uploads.s3.amazonaws.com/expo.advance.net/img/10f63f9486/width2048/acd_sweetspotpetkovic.jpeg',
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
