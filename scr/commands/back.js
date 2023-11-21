const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require('../classes/Command')
const Client = require('../classes/Client')

class CommandBack extends Command {
  constructor() {
    super({
      name: "back",
      data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Volta a tocar a música anterior'),
      type: 'music',
    })
  }

  /**
     * @param {Client} client
  */

  async execute(client, interaction) {
    const { cor } = client
    const queue = client.queues.get(interaction.guild.id);

    if (!queue)
      return super.notQueue(interaction)

    await queue.playBackMusic()
  }
}

module.exports = CommandBack