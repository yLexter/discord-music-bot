"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("../jsons/config.json"));
const { channelError } = config_json_1.default;
const configClient = {
    intents: [
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.Guilds,
    ],
};
class CustomClient extends discord_js_1.Client {
    constructor() {
        super(configClient);
        this.commands = new discord_js_1.Collection();
        this.cooldown = new discord_js_1.Collection();
        this.queues = new discord_js_1.Collection();
        this.cor = discord_js_1.Colors.Red;
        this.timeCooldown = 2.5;
    }
    async startBot() {
        return super.login(process.env.TOKEN);
    }
    sendError(interaction, e) {
        const { member, user, commandName } = interaction;
        const helpMsg = new discord_js_1.EmbedBuilder()
            .setColor(this.cor)
            .setDescription(`**Comando => ${commandName}**\n\n` +
            "```js\n" +
            `- ${e.stack}\n` +
            "```")
            .addFields([
            { name: "Guild", value: member.guild.name, inline: true },
            { name: "User", value: `<@${user.id}>`, inline: true },
        ]);
        return this.channels.cache.get(channelError)?.send({
            embeds: [helpMsg],
        });
    }
    embedError(interaction, error) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ ${error}`);
        console.log(error);
        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
exports.default = CustomClient;
