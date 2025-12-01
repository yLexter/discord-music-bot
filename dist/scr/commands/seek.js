"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class SeekCommand extends Command_1.default {
    constructor() {
        super({
            name: "seek",
            data: new builders_1.SlashCommandBuilder()
                .setName("seek")
                .setDescription("Avança ou retrocede a música atual para um tempo (segundos)")
                .addIntegerOption((opt) => opt
                .setName("time")
                .setDescription("Tempo em segundos para ir")
                .setRequired(true)
                .setMinValue(0)),
            help: "Pula para um tempo específico da música",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        const seconds = interaction.options.getInteger("time", true);
        if (seconds < 0)
            throw new Error("Tempo inválido.");
        const current = queue.songs[0];
        if (!current)
            throw new Error("Nenhuma música tocando");
        if (seconds > current.duration)
            throw new Error("Tempo maior que duração da música");
        await queue.seek(seconds);
        await interaction.reply({
            content: `Avançado para ${seconds}s da música atual.`,
        });
    }
}
exports.default = SeekCommand;
