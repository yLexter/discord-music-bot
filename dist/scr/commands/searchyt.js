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
class SearchYoutubeCommand extends Command_1.default {
    constructor() {
        super({
            name: "searchyt",
            data: new builders_1.SlashCommandBuilder()
                .setName("searchyt")
                .setDescription("Pesquisa uma música no YouTube e adiciona à fila")
                .addStringOption((opt) => opt
                .setName("pmusic")
                .setDescription("Pesquise uma música para tocar")
                .setRequired(true)),
            help: "Pesquisa música no YouTube e toca",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        const member = interaction.member;
        if (!member.voice.channelId)
            throw new Error("Você precisa estar em um canal de voz.");
        if (!queue)
            return super.notQueue(interaction);
        const query = interaction.options.getString("pmusic", true);
        await interaction.deferReply();
        const search = await Queue_1.default.songSearch(query);
        if (search.type !== enums_1.songType.track)
            throw new Error("Aceita apenas músicas (tracks)");
        if (queue.songs.length === 0) {
            queue.songs.push(search);
            await queue.playSong(search);
        }
        else
            queue.songs.push(search);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(client.cor)
            .setTitle("Música adicionada à fila")
            .setDescription(`[${search.title}](${search.url})`)
            .addFields({
            name: "Autor",
            value: search.author.name ?? "Desconhecido",
        });
        await interaction.editReply({ embeds: [embed] });
    }
}
exports.default = SearchYoutubeCommand;
