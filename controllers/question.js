'use strict'

const questions = require('../models/index').questions

async function createQuestion(req, h) {
    let result

    try {
        result = await questions.create(req.payload, req.state.user)
        returnh.response(`Pregunta creada con el ID: ${result}`)
        console.log(`Pregunta creada con el ID: ${result}`)
    } catch (error) {
        console.error(`Ocurrio un error: ${error}`)

        return h.view('ask', {
            title: 'Crear pregunta',
            error: 'Problemas creado la pregunta'
        }).code(500).takeover()
    }
}

module.exports = {createQuestion: createQuestion}