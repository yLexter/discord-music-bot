"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
class PauseCommand extends Command_1.default {
    constructor() {
        super({
            name: "pause",
            data: new builders_1.SlashCommandBuilder()
                .setName("pause")
                .setDescription("Pausa a música atual"),
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        await queue.pause();
        const embed = new discord_js_1.EmbedBuilder().setColor(client.cor).setAuthor({
            name: "| ⏹️ Pausada.",
            iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
    }
}
exports.default = PauseCommand;
