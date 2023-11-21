const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandMove extends Command {
    constructor() {
        super({
            name: "move",
            data: new SlashCommandBuilder()
                .setName('move')
                .setDescription('limpa todas as musicas da queue')
                .addIntegerOption(option =>
                    option
                        .setName('songqueue')
                        .setDescription('Escolha a música que deseja mover')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('novaposicao')
                        .setDescription('Informe a nova posição da música')
                        .setRequired(true)
                ),
            type: 'music',
        })
    }

    async execute(client, interaction) {
        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);
        const oldSongPosition = interaction.options.getInteger('songqueue');
        const newSongPosition = interaction.options.getInteger('novaposicao');

        if (!queue || oldSongPosition == 0 || !queue.songs[oldSongPosition] || newSongPosition <= 0) {
            const embedError = new EmbedBuilder()
                .setColor(cor)
                .addFields(
                    { name: "Queue", value: "Não existe músicas tocando atualmente." },
                    { name: "Parâmetro Inválido", value: "Nenhum parâmetro válido foi fornecido." },
                    { name: 'Posição', value: 'Você não pode escolher 0 como parâmetro.' }
                )
                .setAuthor({ name: `| ❌ Possiveis Erros`, iconURL: interaction.user.displayAvatarURL() })
            return interaction.reply({ embeds: [embedError] })
        }

        const stringPosition = newSongPosition > queue.songs.length ? `última [${queue.songs.length}°]` : `${newSongPosition}°`
        const movedSong = queue.move(oldSongPosition, newSongPosition)

        const embed = new EmbedBuilder()
            .setColor(cor)
            .setDescription(`A **${oldSongPosition}°** Música [${movedSong.title}](${movedSong.url}) , foi movida para **${stringPosition}** posição da queue.`)
            .setAuthor({ name: `| ✔️ Movida`, iconURL: interaction.user.displayAvatarURL() })
        interaction.reply({ embeds: [embed] })
    }
}

module.exports = CommandMove