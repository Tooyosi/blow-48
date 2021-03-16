'use strict';
module.exports = (sequelize, DataTypes) => {
  const task = sequelize.define('task', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  task.associate = function(models) {
    // associations can be defined here
    task.belongsTo(models.project, {
      foreignKey: {
        field: 'projectId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return task;
};