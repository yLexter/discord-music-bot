const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageAttachment } = require("discord.js");

class CommandGetSongs extends Command {
    constructor() {
        super({
            name: "getsongs",
            data: new SlashCommandBuilder()
                .setName('getsongs')
                .setDescription('backup do arquivos de músicas'),
            type: "owner",
        })
    }

    async execute(client, interaction) {

        const { DatabaseSongs } = this
        const json = await DatabaseSongs.getObjectJson()
        const stringJson = JSON.stringify(json, null, 2)
        const file = new MessageAttachment(Buffer.from(stringJson), { name: 'spotifySongs.json'})

        interaction.reply({ files: [file] })

    }

}

module.exports = CommandGetSongs
