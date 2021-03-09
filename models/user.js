'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    account_number: DataTypes.STRING,
    guarantor_form: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    password: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    reset_password_token: DataTypes.STRING,
    reset_password_expiry: DataTypes.DATE
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.belongsTo(models.user_role, {
      foreignKey: {
        field: 'roleId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return user;
};