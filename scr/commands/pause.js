const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/Command')

class CommandPause extends Command {
    constructor() {
        super({
            name: "pause",
            data: new SlashCommandBuilder()
                .setName('pause')
                .setDescription('Pausa a música atual'),
            type: 'music',
        })
    }

    async execute(client, interaction) {
        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction)

        await queue.pause()

        const embed = new EmbedBuilder()
            .setColor(cor)
            .setAuthor({ name: '| ⏹️ Pausada.', iconURL: interaction.user.displayAvatarURL() })
        return interaction.reply({ embeds: [embed] })
    }
}

module.exports = CommandPause