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
        url: 'https://www.bakingbusiness.com/ext/resources/2023/02/13/kellogg_AdSt_Steve-Cukrov_LEAD.jpeg?height=667&t=1676304215&width=1080',
        preview: true,
      },
      {
        eventId: 1,
        url: 'https://i.ebayimg.com/images/g/-U0AAOSwWz9fH~hp/s-l500.jpg',
        preview: false,
      },
      {
        eventId: 2,
        url: 'https://static.wikia.nocookie.net/a6abdbb0-ee4c-4c2f-98c9-b3c67682fe30/scale-to-width-down/800',
        preview: false,
      },
      {
        eventId: 2,
        url: 'https://images.crazygames.com/antarctica-88/20230414020335/antarctica-88-cover?auto=format%2Ccompress&q=45&cs=strip&ch=DPR&fit=crop',
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
