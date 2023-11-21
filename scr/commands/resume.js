const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/Command')

class CommandResume extends Command {
    constructor() {
        super({
            name: "resume",
            data: new SlashCommandBuilder()
                .setName('resume')
                .setDescription('Retorna a tocar música atual'),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction);

        await queue.resume()

        const embed = new EmbedBuilder()
            .setColor(cor)
            .setAuthor({ name: '| ⏹️ Voltando a tocar.', iconURL: interaction.user.displayAvatarURL() })
        return interaction.reply({ embeds: [embed] })
    }
}

module.exports = CommandResume