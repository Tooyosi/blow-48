'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      bank_name: {
        type: Sequelize.STRING
      },
      account_number: {
        type: Sequelize.STRING
      },
      guarantor_form: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user_roles',
          key: 'id',
        },
      },
      password: {
        type: Sequelize.STRING
      },
      is_verified: {
        allowNull: false,
        defaultValue:false,
        type: Sequelize.BOOLEAN
      },
      reset_password_token: {
        type: Sequelize.STRING
      },
      reset_password_expiry: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};