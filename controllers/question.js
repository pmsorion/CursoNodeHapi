'use strict'


const { writeFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const questions = require('../models/index').questions
const { v1: uuidv1 } = require('uuid')

const write = promisify(writeFile)


async function createQuestion(req, h) {
    if (!req.state.user) {
        return h.redirect('/login')
    }

    let result, filename
    try {
        if (Buffer.isBuffer(req.payload.image)) {
            filename = `${uuidv1()}.png`
            await write(join(__dirname, '..', 'public', 'uploads', filename), req.payload.image)
        }
        result = await questions.create(req.payload, req.state.user, filename)
        console.log(`Pregunta creada con el ID: ${result}`)
        return h.redirect(`/question/${result}`)
        //return h.response(`Pregunta creada con el ID: ${result}`)
    } catch (error) {
        console.error(`Ocurrio un error: ${error}`)

        return h.view('ask', {
            title: 'Crear pregunta',
            error: 'Problemas creado la pregunta'
        }).code(500).takeover()
    }
}

async function answerQuestion(req, h) {
    if (!req.state.user) {
        return h.redirect('/login')
    }

    let result
    try {
        result = questions.answer(req.payload, req.state.user)
        console.log(`Respuesta creada: ${result}`)
    } catch (error) {
        console.error(error)
    }

    return h.redirect(`/question/${req.payload.id}`)
}

async function setAnswerRight (req , h) {
    if (!req.state.user) {
        return h.redirect('/login')
    }

    let result
    try {
        result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
        console.log(result)
    } catch (error) {
        console.error(error)
    }

    return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
    createQuestion: createQuestion,
    answerQuestion: answerQuestion,
    setAnswerRight: setAnswerRight
}