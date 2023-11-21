const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');
const Queue = require('../classes/Queue')
const { songType } = require("../enums/index")

class CommandPromisse extends Command {
    constructor() {
        super({
            name: "promisse",
            data: new SlashCommandBuilder()
                .setName('promisse')
                .setDescription('Coloca uma música na 1° posição da queue')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('queue')
                        .setDescription('Coloca uma música da queue em 1° lugar')
                        .addIntegerOption(option =>
                            option
                                .setName('songqueue')
                                .setDescription('Selecione uma música')
                                .setAutocomplete(true)
                                .setRequired(true)
                        )
                ).addSubcommand(subcommand =>
                    subcommand
                        .setName('search')
                        .setDescription('Coloca uma música pesquisada na 1° posição da queue')
                        .addStringOption(option =>
                            option
                                .setName('psearch')
                                .setDescription('Pesquise uma música para colocar na 1° posição')
                                .setRequired(true)
                        )),
            help: "Move uma música para determinada posição da fila.",
            type: 'music',
        })
    }

    async execute(client, interaction) {
        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);
        const subCommand = interaction.options.getSubcommand()
        const subCommands = {
            'search': promisseSearch,
            'queue': queuePromisse,
        }

        if (!queue)
            return super.notQueue(interaction)

        await interaction.deferReply()
        await subCommands[subCommand]()

        async function promisseSearch() {
            const query = interaction.options.getString('psearch')

            if (query.isUrlYoutubePlaylist() || queue.songs.length <= 1) {
                const helpMsg = new EmbedBuilder()
                    .setColor(cor)
                    .addFields(
                        { name: 'Songs', value: 'O Promisse só funciona com mais de 1 música na queue.' },
                        { name: 'Sem músicas:', value: '**Não** existe musicas sendo tocada.' },
                        { name: 'Músicas:', value: 'Quantidade de músicas **insuficiente** para usar o promisse | menor 3.' },
                        { name: "Playlists:", value: "O promissse não aceita playlists de **Spotify** e **Youtube**." })
                    .setAuthor({ name: `| ❌ Prováveis Erros: `, iconURL: interaction.user.displayAvatarURL() })
                return interaction.editReply({ embeds: [helpMsg], ephemeral: true })
            }

            const song = await Queue.songSearch(query)

            if (song.type !== songType.track)
                throw new Error({ content: 'O promisse aceita apenas tracks.' })

            queue.firstMusic(song)
            return embed(song)
        }

        async function queuePromisse() {
            const number = interaction.options.getInteger('songqueue')
            const music = queue?.songs[number]

            if (!music)
                throw new Error("A posição escolhida é inválida")

            queue.move(number, 1)

            return embed(music)
        }

        function embed(song) {
            const helpMsg = new EmbedBuilder()
                .setColor(cor)
                .setDescription(`[${song.title}](${song.url}) [${song.durationFormatted}]`)
                .setAuthor({ name: `| Promissed`, iconURL: interaction.user.displayAvatarURL() })
            return interaction.editReply({ embeds: [helpMsg] })
        }

    }
}

module.exports = CommandPromisse
