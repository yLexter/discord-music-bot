const { EmbedBuilder } = require("discord.js");
const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandLoopQueue extends Command {
  constructor() {
    super({
      name: "loop",
      data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Opções de loop')
        .addSubcommand(subcommand =>
          subcommand
            .setName('song')
            .setDescription('Coloca uma música em loop')
        ).addSubcommand(subcommand =>
          subcommand
            .setName('queue')
            .setDescription('Coloca a queue atual em loop')
        ).addSubcommand(subcommand =>
          subcommand
            .setName('reset')
            .setDescription('Desativa os loops da queue')
        ),
      type: 'music',
    })
  }

  async execute(client, interaction) {

    const { cor } = client
    const queue = client.queues.get(interaction.guild.id)

    if (!queue) 
      return super.notQueue(interaction)
    
    const subCommand = interaction.options.getSubcommand()
    const subCommands = {
      'song': songLoop,
      'queue': queueLoop,
      'reset': resetLoops
    }

    return subCommands[subCommand]()

    function songLoop() {
      const currentLoop = queue.loop() ? 'ativado' : 'desativado'
      const helpMsg = new EmbedBuilder()
        .setColor(cor)
        .setAuthor({ name: `| ♾️ Loop de song ${currentLoop} com sucesso.`, iconURL: interaction.user.displayAvatarURL() })
      return interaction.reply({ embeds: [helpMsg] })
    }

    function queueLoop() {
      const currentLoop = queue.loopQueue() ? 'ativado' : 'desativado'
      const helpMsg = new EmbedBuilder()
        .setColor(cor)
        .setAuthor({ name: `| ♾️ Loop de queue ${currentLoop} com sucesso.`, iconURL: interaction.user.displayAvatarURL() })
      return interaction.reply({ embeds: [helpMsg] })
    }

    function resetLoops() {
      queue.resetLoops()

      const helpMsg = new EmbedBuilder()
        .setColor(cor)
        .setAuthor({ name: `| ♾️ Loop desativado com sucesso.`, iconURL: interaction.user.displayAvatarURL() })
      return interaction.reply({ embeds: [helpMsg] })
    }


  }
}

module.exports = CommandLoopQueue