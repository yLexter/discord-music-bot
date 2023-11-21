const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandFixQueue extends Command {
    constructor() {
        super({
            name: "fixqueue",
            data: new SlashCommandBuilder()
                .setName('fixqueue')
                .setDescription("conserta a queue atual caso esteja bugada"),
            type: 'admin',
        })
    }

    async execute(client, interaction) {

        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction)

        client.queues.delete(interaction.guild.id)
        
        queue.stop()
    }
}

module.exports = CommandFixQueue