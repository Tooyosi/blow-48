'use strict';
module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define('project', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    endDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    supervisorId: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  project.associate = function (models) {
    // associations can be defined here
    project.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user",
      onDelete: 'cascade',
    }),
      project.belongsTo(models.user, {
        foreignKey: "supervisorId",
        as: "supervisor",
        onDelete: 'cascade',
      }),
      project.belongsTo(models.team, {
        foreignKey: {
          field: 'teamId',
          allowNull: false,
        },
        onDelete: 'cascade',
      })
  };
  return project;
};