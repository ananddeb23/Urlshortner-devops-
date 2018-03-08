const Models = require('../../models');
const createUrl = require('../../src/helpers/createShortUrlAndInsert');
const { promisify } = require('util');
const redisClient = require('../redis');


describe('Tests for inserting writing into the db', () => {
  beforeEach((done) => {
    Models.urlstore.truncate().then(() => {
      const redisFlushAll = promisify(redisClient.flushdb).bind(redisClient);
      redisFlushAll().then(() => {
        done();
      });
    });
  });
  test('should create a new url entry', (done) => {
    createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH123456').then((result) => {
      // consol
      expect(result.shortUrl).toBe('HASH12');
      done();
    });
  });
  test('should create only one url entry', (done) => {
    createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH123456').then((result) => {
      // consol
      Models.urlstore.findAll({
        where: {
          shorturl: result.shortUrl,
        },
      }).then((searchResult) => {
        expect(searchResult.length).toBe(1);
        done();
      });
    });
  });
});

describe('Tests for inserting writing into the db with conflict ', () => {
  beforeEach((done) => {
    Models.urlstore.truncate().then(() => {
      const redisFlushAll = promisify(redisClient.flushdb).bind(redisClient);
      redisFlushAll().then(() => {
        done();
      });
    });
  });
  test('should create a new url entry', (done) => {
    createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH12345656').then(() => {
      // consol
      createUrl('newurl', 'HASH12345656').then((result2) => {
        // consol
        expect(result2.shortUrl).toBe('345656');
        done();
      });
    });
  });
  test('should create only two entries in case of duplicate but same hash', (done) => {
    createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH12345656').then(() => {
      // consol
      createUrl('newurl', 'HASH12345656').then(() => {
        Models.urlstore.findAll({

        }).then((searchResult) => {
          expect(searchResult.length).toBe(2);
          done();
        });
      });
    });
  });
});

describe('Tests for inserting writing into the db with same url should just return the url ', () => {
  beforeEach((done) => {
    Models.urlstore.truncate().then(() => {
      const redisFlushAll = promisify(redisClient.flushdb).bind(redisClient);
      redisFlushAll().then(() => {
        done();
      });
    });
  });
  test('should create a new url entry', (done) => {
    createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH12345656').then(() => {
      // consol
      createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH12345656').then((result2) => {
        // consol
        expect(result2.shortUrl).toBe('HASH12');
        done();
      });
    });
  });
  test('should create only one entries in case of duplicate but same url', (done) => {
    createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH12345656').then(() => {
      // consol
      createUrl('https://github.com/abhinavdhasmana/tinyUrl/blob/master/test/lib/createUrl.js', 'HASH12345656').then(() => {
        Models.urlstore.findAll({

        }).then((searchResult) => {
          expect(searchResult.length).toBe(1);
          done();
        });
      });
    });
  });
});
