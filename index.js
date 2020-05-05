'use strict'

const Hapi = require('hapi')
const handlebars = require('./lib/helpers')
const config = require('./config')
const inert = require('inert')
const good = require('good')
const methods = require('./lib/methods')
const path = require('path')
const routes = require('./routes')
const site = require('./controllers/site')
const vision = require('vision')

const server = Hapi.server({
  port: config.port,
  host: config.host,
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init () {
  try {
    await server.register(inert)
    await server.register(vision)
    await server.register({
      plugin: good,
      options: {
        reporters: {
          console: [
            {
              module: 'good-console'
            },
            'stdout'
          ]
        }
      }
    })

    await server.register({
      plugin: require('./lib/api'),
      options: {
        prefix: 'api'
      }
    })

    server.method('setAnswerRight', methods.setAnswerRight)
    server.method('getLast', methods.getLast, {
      cache: {
        expiresIn : 1000 * 60,
        generateTimeout: 2000
      }
    })

    server.state('user', {
      ttl: 1000 * 60 * 60  * 24 * 7,
      isSecure: process.env.NODE_ENV === 'prod',
      encoding: 'base64json',
    })

    server.views({
      engines: {
        hbs: handlebars
      },
      relativeTo: __dirname, 
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.ext('onPreResponse', site.fileNotFound)

    server.route(routes)

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
  server.log('info', `Servidor lanzado en: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  server.log('UnhandledRejection', error)
})

process.on('unhandledException', error => {
  //console.error('unhandledException', error.message, error)
  server.log('unhandledException', error)
})

init()