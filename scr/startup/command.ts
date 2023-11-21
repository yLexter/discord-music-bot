import fs from 'fs'
import path from 'path'
import { Command, CustomClient } from '../entities'
import config from '../config.json'
import { REST, Routes } from 'discord.js'

export default async (client: CustomClient) => {

    const files = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith('.ts'))
    const commands: {}[] = []
    const { serverInfo: { clientId, guildId } } = config

    for (const filename of files) {
        const readCommand = (await import(path.join(__dirname, '../commands', `${filename}`)))?.default
        const command: Command = new readCommand()

        commands.push(command.data.toJSON())
        
        client.commands.set(command.data.name, command)
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || "??");

    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Slashs Commands lidos com sucesso');
    } catch (error) {
        console.error(error);
    }

}