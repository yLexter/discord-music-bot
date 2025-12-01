import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Queue from "../classes/Queue";
import { songType } from "../enums";
import CustomClient from "../classes/Client";

export default class PromisseCommand extends Command {
  constructor() {
    super({
      name: "promisse",
      data: new SlashCommandBuilder()
        .setName("promisse")
        .setDescription("Coloca uma música na 1° posição da queue")
        .addSubcommand((sub) =>
          sub
            .setName("queue")
            .setDescription("Coloca uma música da queue em 1° lugar")
            .addIntegerOption((opt) =>
              opt
                .setName("songqueue")
                .setDescription("Selecione uma música")
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("search")
            .setDescription(
              "Coloca uma música pesquisada na 1° posição da queue"
            )
            .addStringOption((opt) =>
              opt
                .setName("psearch")
                .setDescription(
                  "Pesquise uma música para colocar na 1° posição"
                )
                .setRequired(true)
            )
        ),
      help: "Move uma música para determinada posição da fila.",
      type: "music",
    });
  }

  async execute(
    client: CustomClient,
    interaction: ChatInputCommandInteraction
  ) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    const sub = interaction.options.getSubcommand();
    if (!queue) return super.notQueue(interaction);
    await interaction.deferReply();
    const handlers: Record<string, () => Promise<void>> = {
      search: async () => {
        const query = interaction.options.getString("psearch", true);
        if (
          // (query.isUrlYoutubePlaylist && query.isUrlYoutubePlaylist()) ||
          queue.songs.length <= 1
        ) {
          const embed = new EmbedBuilder()
            .setColor(client.cor)
            .addFields(
              {
                name: "Songs",
                value: "O Promisse só funciona com mais de 1 música na queue.",
              },
              {
                name: "Sem músicas:",
                value: "**Não** existe musicas sendo tocada.",
              },
              {
                name: "Músicas:",
                value:
                  "Quantidade de músicas **insuficiente** para usar o promisse | menor 3.",
              },
              {
                name: "Playlists:",
                value:
                  "O promissse não aceita playlists de **Spotify** e **Youtube**.",
              }
            )
            .setAuthor({
              name: "| ❌ Prováveis Erros: ",
              iconURL: interaction.user.displayAvatarURL(),
            });
          await interaction.editReply({
            embeds: [embed],
            // ephemeral: true
          });
          return;
        }
        const songData = await Queue.songSearch(query);
        if ((songData as any).type !== songType.track)
          throw new Error("O promisse aceita apenas tracks.");
        queue.firstMusic(songData);
        await this.sendResult(
          interaction,
          songData.title,
          songData.url,
          songData.durationFormatted,
          client.cor
        );
      },
      queue: async () => {
        const number = interaction.options.getInteger("songqueue", true);
        const music = queue.songs[number];
        if (!music) throw new Error("A posição escolhida é inválida");
        queue.move(number, 1);
        await this.sendResult(
          interaction,
          music.title,
          music.url,
          music.durationFormatted,
          client.cor
        );
      },
    };
    await handlers[sub]();
  }

  private async sendResult(
    interaction: ChatInputCommandInteraction,
    title: string,
    url: string,
    duration: string,
    color: number
  ) {
    const embed = new EmbedBuilder()
      .setColor(color)
      .setDescription(`[${title}](${url}) [${duration}]`)
      .setAuthor({
        name: "| Promissed",
        iconURL: interaction.user.displayAvatarURL(),
      });
    await interaction.editReply({ embeds: [embed] });
  }
}
