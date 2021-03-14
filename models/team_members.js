'use strict';
module.exports = (sequelize, DataTypes) => {
  const team_members = sequelize.define('team_members', {
    teamId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  team_members.associate = function(models) {
    // associations can be defined here
    team_members.belongsTo(models.team, {
      foreignKey: {
        field: 'teamId',
        allowNull: false,
      },
      onDelete: 'cascade',
    }),

    team_members.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return team_members;
};