const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandSkipto extends Command {
    constructor() {
        super({
            name: "skipto",
            data: new SlashCommandBuilder()
                .setName('skipto')
                .setDescription('skipa para uma música desejada')
                .addIntegerOption(option =>
                    option
                        .setName('songqueue')
                        .setDescription('Informe uma música para skipar')
                        .setRequired(true)
                        .setAutocomplete(true)
                ),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        const queue = client.queues.get(interaction.guild.id);
        const positionSong = interaction.options.getInteger('songqueue');
        const { cor } = client

        await interaction.deferReply()

        if (!queue || !positionSong || !queue.songs[positionSong]) {
            const helpMsg = new EmbedBuilder()
                .setColor(cor)
                .addFields(
                    { name: 'Posição invalida', value: 'Posição escolhida é inválida' },
                    { name: " Queue", value: "Não existe músicas tocando atualmente", inline: true })
                .setAuthor({ name: `| ❌ Possiveis Erros`, iconURL: interaction.user.displayAvatarURL() })
            return interaction.editReply({ embeds: [helpMsg], ephemeral: true })
        }

        interaction.deleteReply().catch(() => { })

        queue.skipTo(positionSong)

    }
}

module.exports = CommandSkipto