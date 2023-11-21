const mongoose = require('mongoose');

class Database {
    constructor() {
        this.user = require('../schemas/User')
    }

    connect() {
        mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
            .then(() => console.log('Database Conectada'))
            .catch(e => console.log(`Erro Ao conectar a database: ${e}`))
    }

    async fecthUser(interaction) {
        const findUser = await this.user.findOne({ id: `${interaction.user.id}` })

        if (findUser)
            return findUser;

        const newUser = await this.user.create({ id: `${interaction.user.id}`, })

        await newUser.save()

        return newUser;
    }

}

module.exports = new Database()