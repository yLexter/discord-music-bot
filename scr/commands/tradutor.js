const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandTradutor extends Command {
    constructor() {
        super({
            name: "tradutor",
            data: new SlashCommandBuilder()
                .setName('tradutor')
                .setDescription('Traduz um texto para linguagem que desejar.')
                .addStringOption(option =>
                    option
                        .setName('linguagem')
                        .setDescription('Digite a linguagem que deseja traduzir')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('texto')
                        .setDescription('Texto que deseja traduzir')
                        .setRequired(true)
                ),
            type: "geral",
            cooldown: 10,
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true })

        const { translateText, jsonConfig: { imgTradutor, languages } } = this
        const { cor } = client
        const text = interaction.options.getString('texto')
        const linguagem = interaction.options.getString('linguagem')
        const limit = 2000

        if (!Object.keys(languages).includes(linguagem))
            throw new Error("A linguagem fornecida é inválida")

        if (!text || text.length > limit)
            throw new Error(`Informe um texto menor que ${limit} caracteres.`);

        const textTranslated = await translateText(text, linguagem) || "Não foi possivel traduzir o texto"
        const helpMsg = new EmbedBuilder()
            .setAuthor({ name: '| Google Tradutor', iconURL: imgTradutor })
            .setColor(cor)
            .setDescription(`**Texto\n**` + `\`\`\`txt\n${text}\n\`\`\`\n` + '**Traduzido**\n```Bash\n' + `"${textTranslated}"` + '```')

        return interaction.editReply({
            embeds: [helpMsg],
            ephemeral: true
        })
    }
}

module.exports = CommandTradutor