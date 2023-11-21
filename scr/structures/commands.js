const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { serverInfo: { guildId, clientId } } = require('../jsons/config.json')
const fs = require('fs')
const path = require('path')

module.exports = (client) => {

    const files = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith('.js'),)
    const commands = []

    for (let filename of files) {
        const readCommand = require(`../commands/${filename}`)
        const command = new readCommand()

        commands.push(command.data.toJSON())

        client.commands.set(command.name, command);
    }

    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
            console.log('Slashs Commands lidos com sucesso');
        } catch (error) {
            console.error(error);
        }
    })()




}