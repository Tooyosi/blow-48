'use strict';
module.exports = (sequelize, DataTypes) => {
  const calender = sequelize.define('calender', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.STRING
  }, {});
  calender.associate = function(models) {
    // associations can be defined here
    calender.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return calender;
};