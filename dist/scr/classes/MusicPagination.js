"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongsPagination = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../enums/index");
const Utils_1 = require("./Utils");
class SongsPagination {
    constructor(options) {
        this.firstPage = 1;
        this.currentPag = 1;
        this.oneSecondInMs = 1000;
        this.title = options.title;
        this.interaction = options.interaction;
        this.amountPerPage = options.amountPerPage || 10;
        this.finishCommand = options.finishCommand || 120;
        this.firstSongIsHeader = options.firstSongIsHeader ? 1 : 0;
        this.hearder = options.hearder;
        this.songs = options.songs;
    }
    getTotalPages() {
        const songs = this.songs();
        const length = songs.length + this.firstSongIsHeader;
        return length < this.amountPerPage
            ? 1
            : Math.ceil(length / this.amountPerPage);
    }
    getFormattedDuration() {
        const songs = this.songs();
        const total = songs.reduce((acc, song) => acc + song.duration, 0);
        return Utils_1.Utils.secondsToText(total / this.oneSecondInMs);
    }
    getPage(pageNumber) {
        const { firstPage, amountPerPage, firstSongIsHeader } = this;
        const songAdditional = firstSongIsHeader ? 0 : 1;
        const songs = this.songs();
        const header = this.hearder ? this.hearder() : "";
        const initalIndex = pageNumber == firstPage
            ? firstSongIsHeader
            : pageNumber * amountPerPage - (amountPerPage + 1) + songAdditional;
        let content = `${header}\n\n`;
        for (let i = initalIndex; i < initalIndex + amountPerPage && songs[i]; i++) {
            const index = firstSongIsHeader ? i : i + 1;
            content += `**${index}**. [${songs[i].title}](${songs[i].url}) [${songs[i].durationFormatted}]\n`;
        }
        return content;
    }
    getEmbed() {
        const { currentPag, title, interaction, firstSongIsHeader } = this;
        const totalPages = this.getTotalPages();
        const formattedDuration = this.getFormattedDuration();
        const songs = this.songs();
        const pageContent = this.getPage(currentPag);
        const totalSongs = firstSongIsHeader
            ? songs.length - 1 == 0
                ? 1
                : songs.length - 1
            : songs.length;
        return new discord_js_1.EmbedBuilder()
            .setColor("DarkBlue")
            .setDescription(pageContent)
            .setAuthor({
            name: `| ${title}`,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .setFooter({
            text: `Total: ${totalSongs} | Pag's: ${currentPag}/${totalPages} | Duração: ${formattedDuration}`,
        });
    }
    getComponentsMessage() {
        const { currentPag, firstPage } = this;
        const totalPages = this.getTotalPages();
        return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId(index_1.pagination.rewindToBeginning)
            .setEmoji("⏮️")
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(currentPag == firstPage), new discord_js_1.ButtonBuilder()
            .setCustomId(index_1.pagination.goBack)
            .setEmoji("⏪")
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(currentPag == firstPage), new discord_js_1.ButtonBuilder()
            .setCustomId(index_1.pagination.advance)
            .setEmoji("⏩")
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(currentPag == totalPages), new discord_js_1.ButtonBuilder()
            .setCustomId(index_1.pagination.advanceToEnd)
            .setEmoji("⏭️")
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setDisabled(currentPag == totalPages));
    }
    editMessage(currentPag) {
        const { interaction } = this;
        interaction
            .editReply({
            embeds: [this.getEmbed()],
            components: [this.getComponentsMessage()],
        })
            .catch(() => { });
    }
    editForFrontPage() {
        this.editMessage((this.currentPag = this.firstPage));
    }
    async startPagination() {
        const { finishCommand, interaction, oneSecondInMs } = this;
        const mainMessage = await interaction.editReply({
            embeds: [this.getEmbed()],
            components: [this.getComponentsMessage()],
        });
        const collector = mainMessage.createMessageComponentCollector({
            filter: (i) => {
                i.deferUpdate();
                return i.user.id == interaction.user.id;
            },
            componentType: discord_js_1.ComponentType.Button,
            time: finishCommand * oneSecondInMs,
            max: 30,
        });
        collector.on("collect", async (i) => {
            const songs = this.songs();
            const totalPages = this.getTotalPages();
            if (!songs.length)
                return collector.stop();
            if (this.currentPag > totalPages)
                return this.editForFrontPage();
            const buttonFunctions = {
                [index_1.pagination.advance]: () => this.editMessage(++this.currentPag),
                [index_1.pagination.goBack]: () => this.editMessage(--this.currentPag),
                [index_1.pagination.advanceToEnd]: () => this.editMessage((this.currentPag = totalPages)),
                [index_1.pagination.rewindToBeginning]: () => this.editForFrontPage(),
            };
            buttonFunctions[i.customId]();
        });
        // collector.on("end", () =>
        //  interaction.editReply({ components: [] }).catch(() => {})
        // );
    }
}
exports.SongsPagination = SongsPagination;
