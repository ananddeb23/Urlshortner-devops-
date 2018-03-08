
const Models = require('../../models');
const crypto = require('crypto');


const urljson = {};
const insertarray = [];
let str = '';

const recursiveInsert = async (longUrl, hash) => {
  const subhash = hash.substring(0, 6);

  if (urljson[subhash] !== undefined) {
    return recursiveInsert(longUrl, hash.substring(6));
  }

  urljson[subhash] = longUrl;
  str = `${str + subhash}\n`;
  const obj = {
    shorturl: subhash,
    longurl: longUrl,
  };
  return insertarray.push(obj);
};
const seedDB = (url, recordcount) => {
  // const promisearray = [];
  for (let i = 0; i < recordcount; i += 1) {
    // console.log(i);
    const urltoencode = `${url}${i}`;
    const hash = crypto.createHash('md5').update(urltoencode).digest('base64').replace(/\//g, '_');


    recursiveInsert(urltoencode, hash);
  }

  // let count = 0;
  // redisClient.flushdb((err, succeeded) => {
  //   console.log(succeeded); // will be true if successfull
  //   const keys = Object.keys(urljson);
  //   console.log(keys.length);
  //   for (let k = 0; k < keys.length; k++) {
  //     const key = keys[k];
  //     const value = urljson[key];
  //     const resobj = {
  //       shorturl: key,
  //       longurl: value,
  //     };
  //     console.log(resobj);
  //     redisClient.hset(key, 'longurl', value);
  //     // console.log(err);
  //     // console.log(reply);
  //     count += 1;
  //     // fs.writeFileSync('./outfile.csv', str);
  //   }
  //   console.log('count', count);
  // redisClient.hmset('urlrecords', urljson, (err, reply) => {
  //   console.log(err);
  //   console.log(reply);
  //   fs.writeFileSync('./outfile.csv', str);
  // });
  // });

  Models.urlstore.bulkCreate(insertarray).then(() => {
    console.log('done!');

    return recordcount;
  });
  //   fs.writeFileSync('./outfile.csv', str);
  return recordcount;
};

module.exports = seedDB;
