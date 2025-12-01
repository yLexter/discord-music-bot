import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class QueueCommand extends Command {
  constructor() {
    super({
      name: "queue",
      data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Mostra as músicas que estão na fila")
        .addIntegerOption((opt) =>
          opt
            .setName("page")
            .setDescription("Mostra a página escolhida")
            .setMinValue(1)
        ),
      help: "Mostra a fila de músicas",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    const member = interaction.member as GuildMember;
    if (!member.voice.channelId)
      throw new Error("Você precisa estar em um canal de voz.");
    if (!queue?.voiceChannelId)
      throw new Error("Erro ao identificar o canal de música.");
    const page = interaction.options.getInteger("page") || 1;
    const embedPagination =
      queue.paginationSongs.get(page) ?? queue.paginationSongs.get(1);
    if (!embedPagination)
      throw new Error("Erro ao localizar embed de paginação.");
    await interaction.reply({
      embeds: [embedPagination.getEmbed()],
      components: [embedPagination.getButtons()],
    });
  }
}
