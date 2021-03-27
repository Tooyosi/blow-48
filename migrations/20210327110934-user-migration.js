'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'img_url',
        {
          type: Sequelize.STRING,
          alloNull: true
        }
      )
    ])
  
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('user', 'img_url'),
    ])
  }
};
