const Hapi = require('hapi');
const good = require('good');


const server = new Hapi.Server();
server.connection({
  port: 4010,
});


server.route(require('./routes/route'));

server.register({
  register: good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*',
        }],
      }, {
        module: 'good-console',
      }, 'stdout'],
    },
  },
}, (err) => {
  if (err) {
    throw err;
  }
});

if (!module.parent) {
  server.start((err) => {
    if (err) {
      throw (err);
    }
    console.log('Server started at port 4010');
  });
}

module.exports = server;
