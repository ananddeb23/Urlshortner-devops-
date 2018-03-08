const Models = require('../../models');
const redisClient = require('../redis');
const { promisify } = require('util');

const redisHget = promisify(redisClient.hget).bind(redisClient);
const redisHset = promisify(redisClient.hset).bind(redisClient);
const getlongUrl = code =>
  redisHget(code, 'longurl')
    .then((res) => {
      if (res === null) {
        console.log('Cache miss');
        return Models.urlstore.findOne({
          where: { shorturl: code },
        })
          .then((obj) => {
            if (obj !== null) {
              console.log(' long url from db ', obj.longurl);
              return redisHset(code, 'longurl', obj.longurl)
                .then(() => obj.longurl);
            }

            return Promise.resolve(' url not in databse');
          });
      }
      console.log(' Cache hit');
      console.log(' res ', res);
      return Promise.resolve(res);
    });
//   const obj = {
//     shorturl: subhash,
//     longurl: longUrl,
//   };
//   redisClient.hgetall('tools', (err, reply) => {
//     console.log(err);
//     console.log('sasdad', code);
//     console.log('data', reply[code]);
//     const res = reply[code];
//     const obj = {
//       longurl: res,
//     };
//     return obj;
//   });
//   getAllAsync('urlrecords').then(res => res[code]);

// redisClient.hget(code, 'longurl', (err, obj) => {
//   console.log(obj);
//   if (obj === undefined) {
//     console.log(' Cache miss');
//     Models.urlstore.findOne({
//       where: { shorturl: code },

//     }).then((obj) => {
//       console.log(' long url ', obj.longurl);
//       redisClient.hset(code, 'longurl', obj.longurl);
//       return obj.longurl;
//     });
//   }
//   console.log(' Cache hit');
//   console.log(' res ', obj);
//   return obj;
//   // console.dir(obj);
// });


// redisClient.hget(code, 'longurl', (err, obj) => {
//   records = obj;
// });
// if (records === undefined) {
//   console.log('its undefined');
//   Models.urlstore.findOne({
//     where: { shorturl: code },

//   });
// }
// // console.log('recodsd',;
// // console(records[code]);
// return records;

// getAllAsync(code, 'longurl').then(res => Object.keys(res).length);

// Models.urlstore.findOne({
//   where: { shorturl: code },

// });
module.exports = getlongUrl;
