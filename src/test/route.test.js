const server = require('../server.js');
const Models = require('../../models');
const { promisify } = require('util');
const redisClient = require('../redis');

// const { redisClient } = server;

const redisHset = promisify(redisClient.hset).bind(redisClient);

beforeEach((done) => {
  Models.urlstore.destroy({ truncate: true }).then(() => {
    done();
  });
});
describe('corretc HTTP response should be given  for ', () => {
  it('/getshorturl  must return response of 200', (done) => {
    const req = {
      method: 'POST',
      payload: { url: 'https://github.com/abhinavdhasmana/tinyUrl/blob/master/src/lib/createUrl.js' },
      url: '/getshorturl',
    };
    server.inject(req, (res) => {
      // console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
      done();
    });
  });
});
describe('corretc HTTP response should be given  for ', () => {
  it('/ping must return response of 200', (done) => {
    const req = {
      method: 'GET',
      url: '/ping',
    };
    server.inject(req, (res) => {
      // console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  it('/ping must return response of pong', (done) => {
    const req = {
      method: 'GET',
      url: '/ping',
    };
    server.inject(req, (res) => {
      // console.log(res);

      expect(res.payload).toBe('pong');
      done();
    });
  });
});

describe('corretc HTTP response should be given  for ', () => {
  it('/seed must return response of 200', (done) => {
    const req = {
      method: 'GET',
      url: '/seed/200',
    };
    server.inject(req, (res) => {
      // console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  it('/seed must return response of correct record count', (done) => {
    const req = {
      method: 'GET',
      url: '/seed/100',
    };
    server.inject(req, (res) => {
      // console.log(res);

      expect(res.payload).toBe('100');
      done();
    });
  });
});

describe('/getlongUrl must return  ', () => {
  it(' response of 200 for an api call', (done) => {
    const req = {
      method: 'GET',
      url: '/getLong?code=3il9MK',
    };
    server.inject(req, (res) => {
      // console.log(res.statusCode);
      expect(res.statusCode).toBe(200);
      done();
    });
  });
  it(' response of long url for  shorturl in database', (done) => {
    const req = {
      method: 'GET',
      url: '/getLong?code=3il9MK',
    };
    const longurl = 'https://www.npmjs.com/package/crypto-md54';
    const shorturl = '3il9MK';
    const obj = {
      shorturl,
      longurl,
    };
    Models.urlstore.create(obj).then(() => {
      // console.log('data');
      server.inject(req, (res) => {
        // console.log(res.statusCode);
        expect(res.payload).toBe('https://www.npmjs.com/package/crypto-md54');
        done();
      });
    });
  });
  it('response with long url if shorturl data is in cache', (done) => {
    const req = {
      method: 'GET',
      url: '/getLong?code=3il9M9',
    };
    const longurl = 'https://www.npmjs.com/package/crypto-md6666';
    const code = '3il9M9';

    redisHset(code, 'longurl', longurl).then(() => {
      server.inject(req, (res) => {
        // console.log(res.statusCode);
        expect(res.payload).toBe(longurl);
        done();
      });
    });
  });
});
