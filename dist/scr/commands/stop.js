"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class StopCommand extends Command_1.default {
    constructor() {
        super({
            name: "stop",
            data: new builders_1.SlashCommandBuilder()
                .setName("stop")
                .setDescription("Para a música e limpa a fila"),
            help: "Para reprodução e limpa queue",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            super.notQueue(interaction);
        queue.stop();
        await interaction.reply({ content: "Fila parada e limpa." });
    }
}
exports.default = StopCommand;
