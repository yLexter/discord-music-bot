const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { EmbedBuilder } = require("discord.js");
const { channelError } = require('../jsons/config.json')

const configClient = {
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds
    ]
}

class CustomClient extends Client {
    constructor() {
        super(configClient)
        this.commands = new Collection()
        this.cooldown = new Collection()
        this.queues = new Collection()
        this.cor = '#4B0082'
        this.timeCooldown = 2.5
    }

    async startBot() {
        super.login(process.env.TOKEN)
    }

    sendError(interaction, e) {
        const { member, user, commandName } = interaction
        const helpMsg = new EmbedBuilder()
            .setColor(this.cor)
            .setDescription(`**Comando => ${commandName}**\n\n` + '```js\n' + `- ${e.stack}\n` + '```')
            .addFields([
                { name: 'Guild', value: member.guild.name, inline: true },
                { name: 'User', value: `<@${user.id}>`, inline: true }
            ])
        return this.channels.cache.get(channelError)?.send({ embeds: [helpMsg] })
    }

    embedError(interaction, error) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ ${error}`)

            console.log(error)

        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

}

module.exports = CustomClient
