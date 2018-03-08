const Models = require('../../models');

const recursiveInsert = (longUrl, hash) => {
  const subhash = hash.substring(0, 6);
  //   const obj = {
  //     shorturl: subhash,
  //     longurl: longUrl,
  //   };
  return Models.urlstore.findOrCreate({
    where: { shorturl: subhash },
    defaults: { longurl: longUrl },
  }).spread((createdobject, created) => {
    if (!created && (createdobject.longurl !== longUrl)) {
      console.log('*****************');
      console.log('CONFLICT');
      console.log('*****************');
      return recursiveInsert(longUrl, hash.substring(6));
    }

    return { longUrl: createdobject.longurl, shortUrl: createdobject.shorturl };
  });
};

const createShortUrlAndInsert = (longUrl, hash) => {
  const res = recursiveInsert(longUrl, hash);
  // console.log('res', res);
  return res.then(result => result);
};

module.exports = createShortUrlAndInsert;
