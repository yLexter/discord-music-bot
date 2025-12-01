"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class ShuffleCommand extends Command_1.default {
    constructor() {
        super({
            name: "shuffle",
            data: new builders_1.SlashCommandBuilder()
                .setName("shuffle")
                .setDescription("Embaralha as músicas da fila mantendo a atual"),
            help: "Embaralha músicas da queue",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        if (queue.songs.length <= 2)
            throw new Error("É necessário mais de 2 músicas para embaralhar");
        queue.shuffle();
        await interaction.reply({ content: "Queue embaralhada." });
    }
}
exports.default = ShuffleCommand;
