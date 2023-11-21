const { EmbedBuilder, } = require("discord.js");
const YouTube = require("youtube-sr").default;
const { SlashCommandBuilder } = require('@discordjs/builders');
const Queue = require('../classes/Queue')
const Command = require('../classes/Command')
const { Song } = require('../classes/Songs')

const wait = require('util').promisify(setTimeout);
const SearchYT = new Map();

class CommandSearchYT extends Command {
  constructor() {
    super({
      name: "searchyt",
      data: new SlashCommandBuilder()
        .setName('searchyt')
        .setDescription('Procura uma música no youtube')
        .addStringOption(option =>
          option
            .setName('search')
            .setDescription('Informe uma música')
            .setRequired(true)
        ),
      type: 'music',
    })
  }

  async execute(client, interaction) {

    const { cor } = client

    try {
      await interaction.deferReply()

      const query = interaction.options.getString('search');
      const isActiveResearch = SearchYT.get(interaction.user.id)
      const filteredList = (await YouTube.search(query, { limit: 10 })).filter(m => m.duration > 0)
      const maximumTime = 30

      if (isActiveResearch || !filteredList.length) {
        const embed = new EmbedBuilder()
          .setColor(cor)
          .setAuthor({ name: `| ❌ Erro`, iconURL: interaction.user.displayAvatarURL() })
          .setDescription('Pesquisa invalida ou Busca em andamento.')
        return interaction.editReply({ embeds: [embed] })
      }

      SearchYT.set(interaction.user.id, true)

      const descriptionSongs = filteredList
        .map((song, index) => `${index + 1}. [${song.title}](${song.url}) [${song.durationFormatted}]`)
        .join('\n')

      const embed = new EmbedBuilder()
        .setColor(cor)
        .setDescription(descriptionSongs)
        .setAuthor({ name: `|🔎 Pesquisa do Youtube`, iconURL: interaction.user.displayAvatarURL() })
        .setFooter({ text: `Digite um número de 1 a ${filteredList.length} dentre ${maximumTime}s para por a música, caso contrário a busca será cancelada | Use !cancel para cancelar.` })
      await interaction.editReply({ embeds: [embed] })

      const collector = interaction.channel.createMessageCollector({
        filter: m => (filteredList[m.content - 1] || m.content == "!cancel") && interaction.user.id === m.author.id,
        time: maximumTime * 1000,
        max: 1
      })

      collector.on('collect', async m => {
        await wait(0.5 * 1000)

        m.delete().catch(() => { })

        if (!m.member.voice.channel || m.content.toLowerCase() == "!cancel")
          return collector.stop();

        const queue = client.queues.get(interaction.guild.id) || new Queue(client, interaction)
        const { id, title, url, duration, durationFormatted } = filteredList[m.content - 1]

        const song = new Song({
          id: id,
          title: title,
          url: url,
          duration: duration,
          durationFormatted: durationFormatted
        })

        queue.play(song)
      });

      collector.on('end', () => {

        interaction.deleteReply().catch(() => { });

        SearchYT.delete(interaction.user.id)
      });

    } catch (e) { SearchYT.delete(interaction.user.id) }

  }
}

module.exports = CommandSearchYT







