import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class NowPlayingCommand extends Command {
  constructor() {
    super({
      name: "nowplaying",
      data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Exibe a música atual"),
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    const song = queue?.songs[0];
    if (!queue || !song) return super.notQueue(interaction);
    const embed = new EmbedBuilder()
      .setColor(client.cor)
      .setDescription(`[${song.title}](${song.url})\n${queue.getProgressBar()}`)
      .setAuthor({
        name: "| 🎶 Tocando Agora",
        iconURL: interaction.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  }
}
