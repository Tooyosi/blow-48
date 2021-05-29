'use strict';
module.exports = (sequelize, DataTypes) => {
  const calender_members = sequelize.define('calender_members', {
    userId: DataTypes.INTEGER,
    calenderId: DataTypes.INTEGER
  }, {});
  calender_members.associate = function (models) {
    // associations can be defined here
    calender_members.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    }),
      calender_members.belongsTo(models.calender, {
        foreignKey: {
          field: 'calenderId',
          allowNull: false,
        },
        onDelete: 'cascade',
      })
  };
  return calender_members;
};