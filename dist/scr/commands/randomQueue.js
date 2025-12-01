"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class RandomQueueCommand extends Command_1.default {
    constructor() {
        super({
            name: "randomqueue",
            data: new builders_1.SlashCommandBuilder()
                .setName("randomqueue")
                .setDescription("Coloca as músicas em posições aleatórias dentro da queue"),
            help: "Embaralha as músicas da queue",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        if (queue.songs.length <= 2)
            throw new Error("Quantidade insuficiente de músicas para randomização");
        const originalLength = queue.songs.length - 1;
        queue.songs = [queue.songs[0]]
            .concat(); // first stays
        if (originalLength !== queue.songs.length - 1)
            throw new Error("Erro ao randomizar a fila");
        await interaction.reply({ content: "Queue embaralhada com sucesso." });
    }
}
exports.default = RandomQueueCommand;
