'use strict'

const bcrypt = require('bcrypt')

class User {
    constructor (db) {
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('users')
    }

    async create(data) {
        //data.password = await this.constructor.encrypt(data.password)
        console.log(data)
        const user = {
            ...data
        }
        user.password = await this.constructor.encrypt(user.password)
        const newUser = this.collection.push(user)
        // newUser.set(data)

        return newUser.key
    }

    static async encrypt (password) {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
}

module.exports = User