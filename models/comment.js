'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    projectId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {});
  comment.associate = function(models) {
    // associations can be defined here
    comment.belongsTo(models.user, {
      foreignKey: {
        field: 'userId',
        allowNull: false,
      },
      onDelete: 'cascade',
    }),
    comment.belongsTo(models.project, {
      foreignKey: {
        field: 'projectId',
        allowNull: false,
      },
      onDelete: 'cascade',
    })
  };
  return comment;
};