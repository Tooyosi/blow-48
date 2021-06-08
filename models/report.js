'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    attachment: DataTypes.STRING
  }, {});
  report.associate = function(models) {
    // associations can be defined here
    report.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return report;
};