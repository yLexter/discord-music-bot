"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class ResumeCommand extends Command_1.default {
    constructor() {
        super({
            name: "resume",
            data: new builders_1.SlashCommandBuilder()
                .setName("resume")
                .setDescription("Retoma a música atual caso esteja pausada"),
            help: "Retoma música pausada",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        if (!queue.player)
            throw new Error("Player não está inicializado.");
        const status = queue.player.state.status;
        if (status === "playing")
            throw new Error("A música já está tocando.");
        queue.player.unpause();
        await interaction.reply({ content: "Música retomada." });
    }
}
exports.default = ResumeCommand;
