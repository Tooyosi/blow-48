'use strict';
module.exports = (sequelize, DataTypes) => {
  const project_attendance = sequelize.define('project_attendance', {
    projectId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    isPresent: DataTypes.BOOLEAN
  }, {});
  project_attendance.associate = function (models) {
    // associations can be defined here
    project_attendance.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    }),
      project_attendance.belongsTo(models.project, {
        foreignKey: {
          field: 'projectId',
          allowNull: false,
        },
        onDelete: 'cascade',
      })
  };
  return project_attendance;
};