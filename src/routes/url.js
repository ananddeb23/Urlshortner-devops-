
const crypto = require('crypto');
require('es6-promise');
const createShortUrlAndInsert = require('../helpers/createShortUrlAndInsert');
const seedDB = require('../helpers/seedDB');
const getlongUrl = require('../helpers/getlongUrl');

module.exports = [
  {
    method: 'POST',
    path: '/getshorturl',
    handler: (request, response) => {
      const longUrl = request.payload.url;
      const hash = crypto.createHash('md5').update(longUrl).digest('base64').replace(/\//g, '_');

      const val = createShortUrlAndInsert(longUrl, hash);
      val.then((result) => {
        response(result).code(200);
      });
    },
  },

  {
    method: 'GET',
    path: '/seed/{seedcount}',
    handler: (request, response) => {
      const url = 'https://www.npmjs.com/package/crypto-md5';

      const val = seedDB(url, request.params.seedcount);
      response(val);
    },

  },
  {
    method: 'GET',
    path: '/getLong',
    handler: (request, response) => {
      getlongUrl(request.query.code)
        .then((val) => {
          console.log('Response:', val);
          response(val).code(200);
        });
    },

  },
  {
    method: 'GET',
    path: '/ping',
    handler: (request, response) => {
      response('pong').code(200);
    },

  },


];

