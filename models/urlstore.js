

module.exports = (sequelize, DataTypes) => {
  const urlstore = sequelize.define('urlstore', {
    shorturl: DataTypes.STRING,
    longurl: DataTypes.STRING,
  }, {});
  urlstore.associate = function (models) {
    // associations can be defined here
  };
  return urlstore;
};
