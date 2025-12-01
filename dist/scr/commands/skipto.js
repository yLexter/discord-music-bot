"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class SkipToCommand extends Command_1.default {
    constructor() {
        super({
            name: "skipto",
            data: new builders_1.SlashCommandBuilder()
                .setName("skipto")
                .setDescription("Pula para uma música específica pela posição na queue")
                .addIntegerOption((opt) => opt
                .setName("songpos")
                .setDescription("Posição da música que deseja pular")
                .setRequired(true)
                .setMinValue(1)),
            help: "Pula para música específica",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        const pos = interaction.options.getInteger("songpos", true);
        const target = queue.songs[pos];
        if (!target)
            throw new Error("Posição inválida");
        queue.skipTo(pos);
        await interaction.reply({ content: `Pulando para: ${target.title}` });
    }
}
exports.default = SkipToCommand;
