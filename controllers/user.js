'use strict'

const Boom = require('boom')
const { user } = require('../models/index')

function register (req, h) {
    return h.view('register')
}

async function createUser (req, h) {
    try {
        const createUserId = await user.create(req.payload)
        return h.response(`Usuario creado ID: ${createUserId}`).code(201)
        //result = await users.create(req.payload)
    } catch (error) {
        console.error(error)
        return h.response('Problemas creado el usuario').code(500)
    }
}

function logout(req, h) {
    return h.redirect('/login').unstate('user')
}


async function validateUser (req, h) {
    try {
        const userLogin = await user.validateUser(req.payload)
        if (!userLogin) {
            return h.response('Email y/o contraseña incorrecta').code(401)
        }
        return h.redirect('/').code(200).state('user' ,{
            name: userLogin.name,
            email: userLogin.email
        })
    } catch (error) {
        console.error(error)
        return h.response('Problemas validando el usuario').code(500)
    }
}

function failValidation(req, h, err) {
    return Boom.badRequest('Fallo la validación', req.payload)
}

module.exports = {
    register: register,
    validateUser: validateUser,
    createUser: createUser,
    logout: logout,
    failValidation: failValidation
}