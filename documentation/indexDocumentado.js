'use strict'

// Requerir el modulo de hapi (Framework)
const Hapi = require('@hapi/hapi')
// Requerir el plugin de hapi para servir archivos estaticos
const inert = require('@hapi/inert')
// Requerir el plugin de hapi para gestionar el motor de plantillas
const vision = require('@hapi/vision')
const path = require('path')

// Configurar el servidor de nuestra aplicación. En un contenedor (Docker) si marca error colocar 0.0.0.0 (todos)
const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  // Definir propiedades generales para todas las rutas. (En este caso indico que las rutas que requieran archivos estáticos, se servirán desde la carpeta public)
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }

})

// Definicion de función para inicializar el proyecto. Intenamnete hay tareas asincronas
asyncfunctioninit() {

  try {
    // Registrar los plugins que hapi va a necesitar (en este caso servir archivos estaticos)
    await server.register(inert)
    // Registrar plugin para gestionar el motor de plantillas
    await server.register(vision)

    // Configurar nuestro motor de plantillas. Usará handlebars y cuando invoquemos una vista automáticamente buscará una con extensión hbs (no hace falta especificarlo). Debe buscar a partir del directorio actual, las vistas se encuentran en views y se activa compatibilidad con layouts, los cuales se encuentran en layouts
    server.views({
      engines: {
        hbs: require('handlebars')
      },
      relativeTo: __dirname,
      path: 'views',
      layout: true,
      layoutPath: 'layouts'
    })

    // Definición de rutas (indicar el método HTTP, URL y controlador de ruta)
    // Se declaran después del plugin ya que las rutas hacen uso del misom para devolver archivos estáticos
    server.route({
      method: 'GET',
      path: '/',
      handler: (req, h) => {
        // El plugin de vision inyecta el metodo view al objeto h para renderizar una vista con el motor de plantillas configurado en la aplicación
        return h.view('index', {
          title: 'Home'
        })
      }
    })

    /**
     * Rutas para el registro de usuarios
     * 
     * el objeto request permite recuperar los datos de la petición. 
     * sus propiedades son path, method, 
     * params, query, get, payload (PUT/POST)
     * 
     * El objeto request tiene un ciclo de vida en HapiJS
     * https://github.com/hapijs/hapi/blob/master/API.md#request-lifecycle
     */
    server.route({
      method: 'GET',
      path: '/register',
      handler: (req, h) => {
        return h.view('register')
      }
    })

    server.route({
      method: 'POST',
      path: '/create-user',
      handler: (req, h) => {
        // Mostrar en consola el cuerpo de la petición
        console.log(req.payload)
        return'Usuario creado satisfactoriamente'
      }
    })

    // Ruta para servir archivos estáticos asociados (img/css/js)
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true
        }
      }
    })

    // Arrancar el servidor de Hapi
    await server.start()
    console.log(`Servidor lanzado en: ${server.info.uri}`)
  } catch (error) {
    console.error(error)
    // Salir de nodeJS con un código de error (1), 0 es un código de exito
    process.exit(1)
  }
}

// Inicializar el proyecto
init();