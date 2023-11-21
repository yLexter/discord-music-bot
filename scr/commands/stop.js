const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandStop extends Command {
    constructor() {
        super({
            name: "stop",
            data: new SlashCommandBuilder()
                .setName('stop')
                .setDescription('para a queue atual'),
            type: 'music',
        })
    }

    async execute(client, interaction) {

        await interaction.deferReply()

        const queue = client.queues.get(interaction.guild.id);

        if (!queue)
            return super.notQueue(interaction)

        interaction.deleteReply().catch(() => { })

        queue.stop()
        
        client.queues.delete(interaction.guild.id)
    }
}

module.exports = CommandStop