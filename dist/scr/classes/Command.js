"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Base_1 = __importDefault(require("./Base"));
class Command extends Base_1.default {
    constructor(options) {
        super();
        this.name = options.name;
        this.data = options.data;
        this.type = options.type;
        this.cooldown = options.cooldown || 2;
        this.cor = options.cor || "RANDOM";
    }
    notQueue(interaction) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ Não existe uma queue ativa no servidor`);
        if (interaction.deferred)
            return interaction.editReply({
                embeds: [embed],
                //  ephemeral: true
            });
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    sucessMessage(interaction, message) {
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`✅ ${message}`)
            .setColor("Green");
        if (interaction.deferred)
            return interaction.editReply({
                embeds: [embed],
                // ephemeral: true
            });
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
exports.default = Command;
