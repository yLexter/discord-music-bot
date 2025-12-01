"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
class NowPlayingCommand extends Command_1.default {
    constructor() {
        super({
            name: "nowplaying",
            data: new builders_1.SlashCommandBuilder()
                .setName("nowplaying")
                .setDescription("Exibe a música atual"),
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        const song = queue?.songs[0];
        if (!queue || !song)
            return super.notQueue(interaction);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(client.cor)
            .setDescription(`[${song.title}](${song.url})\n${queue.getProgressBar()}`)
            .setAuthor({
            name: "| 🎶 Tocando Agora",
            iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
    }
}
exports.default = NowPlayingCommand;
