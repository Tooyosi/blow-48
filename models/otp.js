'use strict';
module.exports = (sequelize, DataTypes) => {
  const otp = sequelize.define('otp', {
    otp: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    expiry: DataTypes.DATE,
    validated: DataTypes.BOOLEAN,
    otp_for: DataTypes.STRING
  }, {});
  otp.associate = function(models) {
    // associations can be defined here
    otp.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return otp;
};