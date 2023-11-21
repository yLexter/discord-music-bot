const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');


class CommandSeek extends Command {
    constructor() {
        super({
            name: "seek",
            data: new SlashCommandBuilder()
                .setName('seek')
                .setDescription('Coloca a música na minutagem que deseja')
                .addStringOption(option =>
                    option
                        .setName('minutagem')
                        .setDescription('Informe a minutagem que deseja')
                        .setRequired(true)
                ),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply()

        const queue = client.queues.get(interaction.guild.id);
        const minutes = interaction.options.getString('minutagem');
        const { cor } = client
        const { Utils: { secondsToText, textToSeconds } } = this

        if (!queue)
            return super.notQueue(interaction)

        const duration = await textToSeconds(minutes)

        await queue.seek(duration)

        const helpMsg = new EmbedBuilder()
            .setColor(cor)
            .setAuthor({ name: `| Seeking para ${secondsToText(duration)}`, iconURL: interaction.user.displayAvatarURL() })
        return interaction.editReply({ embeds: [helpMsg] })
    }
}

module.exports = CommandSeek