const play = require('play-dl')
const Database = require('../classes/Database')
const mongoose = require("mongoose")
const { Events } = require('discord.js')

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {

        mongoose.set("strictQuery", true)

        console.log(`O bot ${client.user.username} está online`)

        client.user.setActivity(`De Darius Obviamente.`)

        Database.connect()

        play.getFreeClientID()
            .then(clientID => play.setToken({ soundcloud: { client_id: clientID } }))
            .catch(e => console.log(e))

    }
}
