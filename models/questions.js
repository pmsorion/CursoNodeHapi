'use strict'

class Quiestions {
    constructor(db) {
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('questions')
    }

    async create (data, user) {
        const ask = {
            ...data
        }
        ask.owner = user
        const question = this.collection.push()
        question.set(ask)

        return question.key
    }
}

module.exports = Quiestions