'use strict'

const Hapi = require('hapi');
const handlebars = require('handlebars');
const config = require('./config');
const inert = require('inert');
const path = require('path');
const routes = require('./routes');
const vision = require('vision');

const server = Hapi.server({
  port: config.port,
  host: config.host,
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
});

async function init () {
  try {
    await server.register(inert);
    await server.register(vision);

    server.views({
      engines: {
        hbs: handlebars
      },
      relativeTo: __dirname, 
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.route(routes)

    await server.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Servidor lanzado en: http://${config.host}:${config.port}`);
}

init();