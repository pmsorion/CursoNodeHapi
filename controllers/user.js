'use strict'

const Boom = require('boom')
const { user } = require('../models/index')

function register (req, h) {
    return h.view('register')
}

async function createUser (req, h) {
    try {
        const createUserId = await user.create(req.payload)
        //return h.response(`Usuario creado ID: ${createUserId}`).code(201)
        return h.view('register', {
            title: 'Registro',
            success: 'Usuario creado exitosamente'
        })
    } catch (error) {
        console.error(error)
        return h.view('register', {
            title: 'Registro',
            error: 'Error creando el usuario'
        })
        //return h.response('Problemas creado el usuario').code(500)
    }
}

function logout(req, h) {
    return h.redirect('/login').unstate('user')
}


async function validateUser (req, h) {
    try {
        const userLogin = await user.validateUser(req.payload)
        if (!userLogin) {
            //return h.response('Email y/o contraseña incorrecta').code(401)
            return h.view('login', {
                title: 'Login',
                error: 'Email y/o contraseña incorrecta'
            })
        }
        return h.redirect('/').code(200).state('user' ,{
            name: userLogin.name,
            email: userLogin.email
        })
    } catch (error) {
        console.error(error)
        //return h.response('Problemas validando el usuario').code(500)
        return h.view('login', {
            title: 'Login',
            error: 'Problemas validando el usuario'
        })
    }
}

function failValidation(req, h, err) {
    const templates = {
        '/create-user': 'register',
        '/validate-user': 'login'
    }
    return h.view(templates[req.path], {
        title: 'Error de validacion',
        error: 'Por favor complete los campos requeridos'
    }).code(400).takeover()

    return Boom.badRequest('Fallo la validación', req.payload)
}

module.exports = {
    register: register,
    validateUser: validateUser,
    createUser: createUser,
    logout: logout,
    failValidation: failValidation
}