'use strict'

const firebase = require('firebase-admin')
const serviceAccount = require('../config/firebase.json')

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://platzioverflow-35461.firebaseio.com"
})

const db = firebase.database()

const User = require('./users')

module.exports = {
    user: new User(db)
}