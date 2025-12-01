"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
class EvalCommand extends Command_1.default {
    constructor() {
        super({
            name: "eval",
            data: new builders_1.SlashCommandBuilder()
                .setName("eval")
                .setDescription("Executa comandos como caller")
                .addStringOption((opt) => opt
                .setName("comando")
                .setDescription("Digite o comando para executar")
                .setRequired(true)),
            type: "owner",
        });
    }
    async execute(client, interaction) {
        const comando = interaction.options.getString("comando", true);
        try {
            // eslint-disable-next-line no-eval
            const resultadoOk = await eval(`(async () => { return ${comando}})()`);
            const resultado = JSON.stringify(resultadoOk, null, "\t")?.substring(0, 3000);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(client.cor)
                .setDescription(`📥 **Entrada**\n\n\`\`\`txt\n${comando}\n\`\`\`\n\n📤 **Saída**\n\n\`\`\`txt\n${resultado}\n\`\`\``);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        catch (e) {
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(client.cor)
                .setDescription(`📥 **Entrada**\n\n\`\`\`txt\n${comando}\n\`\`\`\n\n📤 **Saída**\n\n\`\`\`js\n- ${e.stack}\n\`\`\``);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
exports.default = EvalCommand;
