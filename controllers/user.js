'use strict'

const { user } = require('../models/index')

function register (req, h) {
    return h.view('register')
}

async function createUser (req, h) {
    //let result
    try {
        const createUserId = await user.create(req.payload)
        return h.response(`Usuario creado ID: ${createUserId}`).code(201)
        //result = await users.create(req.payload)
    } catch (error) {
        console.error(error)
        return h.response('Problemas creado el usuario').code(500)
    }

    return h.response(`Usuario creado ID: ${result}`)
}

async function validateUser (req, h) {
    try {
        const userLogin = await user.validateUser(req.payload)
        return userLogin
    } catch (error) {
        console.error(error)
        return h.response('Problemas validando el usuario').code(500)
    }
}

module.exports = {
    register: register,
    validateUser: validateUser,
    createUser: createUser
}