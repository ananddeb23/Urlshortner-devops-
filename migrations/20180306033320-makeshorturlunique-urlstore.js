module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query('ALTER TABLE urlstores ADD CONSTRAINT urlstore_shorturl_key UNIQUE(shorturl)');
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.sequelize
      .query('ALTER TABLE urlstores DROP CONSTRAINT urlstore_shorturl_key;');
  },
};
