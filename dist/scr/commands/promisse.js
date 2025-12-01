"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
const Queue_1 = __importDefault(require("../classes/Queue"));
const enums_1 = require("../enums");
class PromisseCommand extends Command_1.default {
    constructor() {
        super({
            name: "promisse",
            data: new builders_1.SlashCommandBuilder()
                .setName("promisse")
                .setDescription("Coloca uma música na 1° posição da queue")
                .addSubcommand((sub) => sub
                .setName("queue")
                .setDescription("Coloca uma música da queue em 1° lugar")
                .addIntegerOption((opt) => opt
                .setName("songqueue")
                .setDescription("Selecione uma música")
                .setAutocomplete(true)
                .setRequired(true)))
                .addSubcommand((sub) => sub
                .setName("search")
                .setDescription("Coloca uma música pesquisada na 1° posição da queue")
                .addStringOption((opt) => opt
                .setName("psearch")
                .setDescription("Pesquise uma música para colocar na 1° posição")
                .setRequired(true))),
            help: "Move uma música para determinada posição da fila.",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        const sub = interaction.options.getSubcommand();
        if (!queue)
            return super.notQueue(interaction);
        await interaction.deferReply();
        const handlers = {
            search: async () => {
                const query = interaction.options.getString("psearch", true);
                if (
                // (query.isUrlYoutubePlaylist && query.isUrlYoutubePlaylist()) ||
                queue.songs.length <= 1) {
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor(client.cor)
                        .addFields({
                        name: "Songs",
                        value: "O Promisse só funciona com mais de 1 música na queue.",
                    }, {
                        name: "Sem músicas:",
                        value: "**Não** existe musicas sendo tocada.",
                    }, {
                        name: "Músicas:",
                        value: "Quantidade de músicas **insuficiente** para usar o promisse | menor 3.",
                    }, {
                        name: "Playlists:",
                        value: "O promissse não aceita playlists de **Spotify** e **Youtube**.",
                    })
                        .setAuthor({
                        name: "| ❌ Prováveis Erros: ",
                        iconURL: interaction.user.displayAvatarURL(),
                    });
                    await interaction.editReply({
                        embeds: [embed],
                        // ephemeral: true
                    });
                    return;
                }
                const songData = await Queue_1.default.songSearch(query);
                if (songData.type !== enums_1.songType.track)
                    throw new Error("O promisse aceita apenas tracks.");
                queue.firstMusic(songData);
                await this.sendResult(interaction, songData.title, songData.url, songData.durationFormatted, client.cor);
            },
            queue: async () => {
                const number = interaction.options.getInteger("songqueue", true);
                const music = queue.songs[number];
                if (!music)
                    throw new Error("A posição escolhida é inválida");
                queue.move(number, 1);
                await this.sendResult(interaction, music.title, music.url, music.durationFormatted, client.cor);
            },
        };
        await handlers[sub]();
    }
    async sendResult(interaction, title, url, duration, color) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(color)
            .setDescription(`[${title}](${url}) [${duration}]`)
            .setAuthor({
            name: "| Promissed",
            iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.editReply({ embeds: [embed] });
    }
}
exports.default = PromisseCommand;
