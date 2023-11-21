import { Client, GatewayIntentBits, Collection, Colors } from 'discord.js'
import { Command } from './Command'

const configClient = {
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
    ]
}

class CustomClient extends Client {
    public cor
    public cooldowns: Collection<String, number>
    public commands: Collection<string, Command>
    public timeCooldown: number

    constructor() {
        super(configClient)
        this.cor = Colors.Purple
        this.cooldowns = new Collection()
        this.commands = new Collection()
        this.timeCooldown = 2
    }

    startBot() {
        return this.login(process.env.TOKEN_BOT)
    }

}

export { CustomClient }
