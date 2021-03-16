'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('user_roles', [{
      role: 'Management',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'Project Manager',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'Accountants',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'Ambassadors',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
