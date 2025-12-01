import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";
import { songType } from "../enums";

export default class SearchYoutubeCommand extends Command {
  constructor() {
    super({
      name: "searchyt",
      data: new SlashCommandBuilder()
        .setName("searchyt")
        .setDescription("Pesquisa uma música no YouTube e adiciona à fila")
        .addStringOption((opt) =>
          opt
            .setName("pmusic")
            .setDescription("Pesquise uma música para tocar")
            .setRequired(true)
        ),
      help: "Pesquisa música no YouTube e toca",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    const member = interaction.member as GuildMember;
    if (!member.voice.channelId)
      throw new Error("Você precisa estar em um canal de voz.");
    if (!queue) return super.notQueue(interaction);
    const query = interaction.options.getString("pmusic", true);
    await interaction.deferReply();
    const search = await Queue.songSearch(query);
    if ((search as any).type !== songType.track)
      throw new Error("Aceita apenas músicas (tracks)");
    if (queue.songs.length === 0) {
      queue.songs.push(search as any);
      await queue.playSong(search as any);
    } else queue.songs.push(search as any);
    const embed = new EmbedBuilder()
      .setColor(client.cor)
      .setTitle("Música adicionada à fila")
      .setDescription(`[${search.title}](${search.url})`)
      .addFields({
        name: "Autor",
        value: search.author.name ?? "Desconhecido",
      });
    await interaction.editReply({ embeds: [embed] });
  }
}
