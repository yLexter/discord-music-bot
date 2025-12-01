"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
class LoopCommand extends Command_1.default {
    constructor() {
        super({
            name: "loop",
            data: new builders_1.SlashCommandBuilder()
                .setName("loop")
                .setDescription("Opções de loop")
                .addSubcommand((sub) => sub.setName("song").setDescription("Coloca uma música em loop"))
                .addSubcommand((sub) => sub.setName("queue").setDescription("Coloca a queue atual em loop"))
                .addSubcommand((sub) => sub.setName("reset").setDescription("Desativa os loops da queue")),
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        const sub = interaction.options.getSubcommand();
        const handlers = {
            song: async () => {
                const currentLoop = queue.loop() ? "ativado" : "desativado";
                const embed = new discord_js_1.EmbedBuilder().setColor(client.cor).setAuthor({
                    name: `| ♾️ Loop de song ${currentLoop} com sucesso.`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
                await interaction.reply({ embeds: [embed] });
            },
            queue: async () => {
                const currentLoop = queue.loopQueue() ? "ativado" : "desativado";
                const embed = new discord_js_1.EmbedBuilder().setColor(client.cor).setAuthor({
                    name: `| ♾️ Loop de queue ${currentLoop} com sucesso.`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
                await interaction.reply({ embeds: [embed] });
            },
            reset: async () => {
                queue.resetLoops();
                const embed = new discord_js_1.EmbedBuilder().setColor(client.cor).setAuthor({
                    name: `| ♾️ Loop desativado com sucesso.`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
                await interaction.reply({ embeds: [embed] });
            },
        };
        await handlers[sub]();
    }
}
exports.default = LoopCommand;
