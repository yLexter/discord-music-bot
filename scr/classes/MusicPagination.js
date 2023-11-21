const { secondsToText } = require("./Utils")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js")
const { pagination } = require("../enums/index")

class SongsPagination {
    constructor(options) {
        this.firstPage = 1
        this.currentPag = 1
        this.oneSecondInMs = 1000
        this.title = options.title
        this.hearder = options.hearder
        this.interaction = options.interaction
        this.amountPerPage = options.amountPerPage || 10
        this.finishCommand = options.finishCommand || 120
        this.songs = options.songs
        this.firstSongIsHeader = options.firstSongIsHeader ? 1 : 0
    }

    getTotalPages() {
        const songs = this.songs()
        const length = songs.length + this.firstSongIsHeader
        return length < this.amountPerPage ? 1 : Math.ceil((length / this.amountPerPage))
    }

    getFormattedDuration() {
        const songs = this.songs()
        const total = songs.reduce((acc, song) => acc + song.duration, 0)
        return secondsToText(total / this.oneSecondInMs)
    }

    getPage(pageNumber) {
        const { firstPage, amountPerPage, firstSongIsHeader } = this
        const songAdditional = firstSongIsHeader ? 0 : 1
        const songs = this.songs()
        const header = this.hearder ? this.hearder() : ""
        const initalIndex = pageNumber == firstPage ? firstSongIsHeader : (pageNumber * amountPerPage) - (amountPerPage + 1) + songAdditional
        let content = `${header}\n\n`

        for (let i = initalIndex; (i < initalIndex + amountPerPage) && songs[i]; i++) {
            const index = firstSongIsHeader ? i : i + 1
            content += `**${index}**. [${songs[i].title}](${songs[i].url}) [${songs[i].durationFormatted}]\n`;
        }

        return content
    }

    getEmbed() {
        const { currentPag, title, interaction, firstSongIsHeader } = this
        const totalPages = this.getTotalPages()
        const formattedDuration = this.getFormattedDuration()
        const songs = this.songs()
        const pageContent = this.getPage(currentPag)
        const totalSongs = firstSongIsHeader ? songs.length - 1 == 0 ? 1 : songs.length - 1 : songs.length

        return new EmbedBuilder()
            .setColor('DarkBlue')
            .setDescription(pageContent)
            .setAuthor({ name: `| ${title}`, iconURL: interaction.user.displayAvatarURL() })
            .setFooter({ text: `Total: ${totalSongs} | Pag's: ${currentPag}/${totalPages} | Duração: ${formattedDuration}` })
    }

    getComponentsMessage() {
        const { currentPag, firstPage } = this
        const totalPages = this.getTotalPages()

        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(pagination.rewindToBeginning)
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPag == firstPage),
                new ButtonBuilder()
                    .setCustomId(pagination.goBack)
                    .setEmoji('⏪')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPag == firstPage),
                new ButtonBuilder()
                    .setCustomId(pagination.advance)
                    .setEmoji('⏩')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPag == totalPages),
                new ButtonBuilder()
                    .setCustomId(pagination.advanceToEnd)
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPag == totalPages),
            )
    }

    editMessage(currentPag) {
        const { interaction } = this

        interaction.editReply({
            embeds: [this.getEmbed(currentPag)],
            components: [this.getComponentsMessage()]
        }).catch(() => { })
    }

    editForFrontPage() {
        this.editMessage(this.currentPag = this.firstPage)
    }

    async startPagination() {
        const { finishCommand, interaction, oneSecondInMs } = this
        const mainMessage = await interaction.editReply({
            embeds: [this.getEmbed(this.currentPag)],
            components: [this.getComponentsMessage()]
        })

        const collector = await mainMessage.createMessageComponentCollector({
            filter: i => {
                i.deferUpdate()
                return i.user.id == interaction.user.id
            },
            componentType: ComponentType.Button,
            time: finishCommand * oneSecondInMs,
            max: 30
        });

        collector.on('collect', async i => {
            const songs = this.songs()
            const totalPages = this.getTotalPages()

            if (!songs.length)
                return collector.stop();

            if (this.currentPag > totalPages)
                return this.editForFrontPage();

            const buttonFunctions = {
                [pagination.advance]: () => this.editMessage(++this.currentPag),
                [pagination.goBack]: () => this.editMessage(--this.currentPag),
                [pagination.advanceToEnd]: () => this.editMessage(this.currentPag = totalPages),
                [pagination.rewindToBeginning]: () => this.editForFrontPage()
            }

            buttonFunctions[i.customId]()
        })

        collector.on('end', () => interaction.editReply({ components: [] }).catch(() => { }))
    }

}

module.exports = SongsPagination