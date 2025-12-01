"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
class MoveCommand extends Command_1.default {
    constructor() {
        super({
            name: "move",
            data: new builders_1.SlashCommandBuilder()
                .setName("move")
                .setDescription("Move uma música para nova posição da queue")
                .addIntegerOption((opt) => opt
                .setName("songqueue")
                .setDescription("Escolha a música que deseja mover")
                .setRequired(true)
                .setAutocomplete(true))
                .addIntegerOption((opt) => opt
                .setName("novaposicao")
                .setDescription("Informe a nova posição da música")
                .setRequired(true)),
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        const oldPos = interaction.options.getInteger("songqueue", true);
        const newPos = interaction.options.getInteger("novaposicao", true);
        if (!queue || oldPos === 0 || !queue.songs[oldPos] || newPos <= 0) {
            const embedError = new discord_js_1.EmbedBuilder()
                .setColor(client.cor)
                .addFields({ name: "Queue", value: "Não existe músicas tocando atualmente." }, {
                name: "Parâmetro Inválido",
                value: "Nenhum parâmetro válido foi fornecido.",
            }, { name: "Posição", value: "Você não pode escolher 0 como parâmetro." })
                .setAuthor({
                name: "| ❌ Possíveis Erros",
                iconURL: interaction.user.displayAvatarURL(),
            });
            return interaction.reply({ embeds: [embedError] });
        }
        const stringPosition = newPos > queue.songs.length
            ? `última [${queue.songs.length}°]`
            : `${newPos}°`;
        const movedSong = queue.move(oldPos, newPos);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(client.cor)
            .setDescription(`A **${oldPos}°** Música [${movedSong.title}](${movedSong.url}) , foi movida para **${stringPosition}** posição da queue.`)
            .setAuthor({
            name: "| ✔️ Movida",
            iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
    }
}
exports.default = MoveCommand;
