"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class QueueCommand extends Command_1.default {
    constructor() {
        super({
            name: "queue",
            data: new builders_1.SlashCommandBuilder()
                .setName("queue")
                .setDescription("Mostra as músicas que estão na fila")
                .addIntegerOption((opt) => opt
                .setName("page")
                .setDescription("Mostra a página escolhida")
                .setMinValue(1)),
            help: "Mostra a fila de músicas",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        const member = interaction.member;
        if (!member.voice.channelId)
            throw new Error("Você precisa estar em um canal de voz.");
        // if (!queue?.voiceChannelId)
        //   throw new Error("Erro ao identificar o canal de música.");
        const page = interaction.options.getInteger("page") || 1;
        const embedPagination = {};
        // queue.paginationSongs.get(page) ?? queue.paginationSongs.get(1);
        //if (!embedPagination)
        //  throw new Error("Erro ao localizar embed de paginação.");
        await interaction.reply({
            embeds: [embedPagination.getEmbed()],
            components: [embedPagination.getButtons()],
        });
    }
}
exports.default = QueueCommand;
