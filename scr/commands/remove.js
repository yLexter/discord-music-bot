const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandRemove extends Command {
    constructor() {
        super({
            name: "remove",
            data: new SlashCommandBuilder()
                .setName('remove')
                .setDescription('Remove uma música')
                .addIntegerOption(option =>
                    option
                        .setName('songqueue')
                        .setDescription('Informe uma música remover a música')
                        .setRequired(true)
                        .setAutocomplete(true)
                ),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        const { cor } = client
        const queue = client.queues.get(interaction.guild.id);
        const removeTo = interaction.options.getInteger('songqueue');

        if (!queue || !removeTo || !queue.songs[removeTo]) {
            const helpMsg = new EmbedBuilder()
                .setColor(cor)
                .addFields(
                    { name: 'Posição invalida', value: 'Posição escolhida é inválida' },
                    { name: " Queue", value: "Não existe músicas tocando atualmente", inline: true })
                .setAuthor({ name: `| ❌ Possiveis Erros`, iconURL: interaction.user.displayAvatarURL() })
            return interaction.reply({ embeds: [helpMsg], ephemeral: true })
        }

        const songRemoved = queue.remove(removeTo)
        const helpMsg = new EmbedBuilder()
            .setColor(cor)
            .setDescription(`[${songRemoved.title}](${songRemoved.url}) [${songRemoved.durationFormatted}]`)
            .setAuthor({ name: `| ✔️ Removida:`, iconURL: interaction.user.displayAvatarURL() })
        interaction.reply({ embeds: [helpMsg] })

    }
}

module.exports = CommandRemove