const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandSkip extends Command {
    constructor() {
        super({
            name: "skip",
            data: new SlashCommandBuilder()
                .setName('skip')
                .setDescription('skipa para proxima música'),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply()

        const queue = client.queues.get(interaction.guild.id);

        if (!queue) 
            return super.notQueue(interaction)

        interaction.deleteReply().catch(() => {})

        queue.skip()

    }
}

module.exports = CommandSkip