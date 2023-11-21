const { EmbedBuilder } = require('discord.js')
const Base = require("./Base")

class Command extends Base {
    constructor(options) {
        super()
        this.name = options.name
        this.data = options.data
        this.type = options.type
        this.cooldown = options.cooldown || 2
        this.cor = options.cor || 'RANDOM'
    }

    notQueue(interaction) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ Não existe uma queue ativa no servidor`)

        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    sucessMessage(interaction, message) {
        const embed = new EmbedBuilder()
            .setDescription(`✅ ${message}`)
            .setColor("Green")

        if (interaction.deferred)
            return interaction.editReply({ embeds: [embed], ephemeral: true });

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }

}

module.exports = Command