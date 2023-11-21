const fs = require('fs')
const path = require('path')

module.exports = (client) => {

    const files = fs.readdirSync(path.join(__dirname, "../events"))

    for (let eventFile of files) {
        const evento = require(`../events/${eventFile}`)
        if (evento.once) {
            client.once(evento.name, (...args) => evento.execute(client, ...args));
        } else {
            client.on(evento.name, (...args) => evento.execute(client, ...args));
        }
    }

    console.log('Eventos lidos com sucesso')

}