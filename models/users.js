'use strict'

const bcrypt = require('bcrypt')

class User {
    constructor (db) {
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('users')
    }

    async create(data) {
        console.log(data)
        const user = {
            ...data
        }
        user.password = await this.constructor.encrypt(user.password)
        const newUser = this.collection.push(user)
        return newUser.key
    }

    async validateUser (data) {
        const userQuery = await this.collection.orderByChild('email').equalTo(data.email).once('value')
        const userFound = userQuery.val()
        if (userFound) {
            const userId = Object.keys(userFound)[0]
            const passwordRight = await bcrypt.compare(data.password, userFound[userId].password)
            return (passwordRight) ? userFound[userId] : false
        }
        return false
    }

    static async encrypt (password) {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
}

module.exports = User