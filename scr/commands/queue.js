
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandQueue extends Command {
    constructor() {
        super({
            name: "queue",
            data: new SlashCommandBuilder()
                .setName('queue')
                .setDescription('Mostra todas as música da queue'),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true })

        const { SongsPagination } = this
        const queue = client.queues.get(interaction.guild.id)

        if (!queue)
            return super.notQueue(interaction)

        const pagination = new SongsPagination({
            interaction: interaction,
            finishCommmand: 120,
            amountPerPage: queue.amountPerPage,
            title: "📑 Queue",
            firstSongIsHeader: true,
            songs: () => client.queues.get(interaction.guild.id) ? queue.getSongs() : [],
            hearder: () => client.queues.get(interaction.guild.id) ? queue.getHeader() : "??"
        })

        return pagination.startPagination()
    }
}


module.exports = CommandQueue