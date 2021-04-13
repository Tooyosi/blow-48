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
      ),
      queryInterface.addColumn(
        'users',
        'isOnline',
        {
          type: Sequelize.BOOLEAN,
          defaultValue:false,
          alloNull: true
        }
      )
    ])
  
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'img_url'),
      queryInterface.removeColumn('users', 'isOnline'),
    ])
  }
};
