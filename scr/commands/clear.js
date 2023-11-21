const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandClear extends Command {
    constructor() {
        super({
            name: "clear",
            data: new SlashCommandBuilder()
                .setName('clear')
                .setDescription('limpa todas as musicas da queue'),
            type: 'music',
        })
    }

    async execute(client, interaction) {
        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction)

        await queue.clear()

        const embed = new EmbedBuilder()
            .setColor(cor)
            .setAuthor({ name: `| ✔️ Queue Limpa.`, iconURL: interaction.user.displayAvatarURL() })
        return interaction.reply({ embeds: [embed] })
    }
}

module.exports = CommandClear