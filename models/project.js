'use strict';
module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define('project', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    endDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    supervisor: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  project.associate = function (models) {
    // associations can be defined here
    project.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    }),
     project.belongsTo(models.user, {
      foreignKey: {
        field: 'supervisor',
        allowNull: false,
      },
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