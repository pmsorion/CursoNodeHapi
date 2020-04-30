'use strict'

const Hapi = require('hapi');
const config = require('./config');

const server = Hapi.server({
  port: config.port,
  host: config.host
});

async function init () {
  server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return 'Hola mundo mundial! ...'
    }
  });

  try {
    await server.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Servidor lanzado en: ${server.info.uri}`);
}

init();