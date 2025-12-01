import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class PauseCommand extends Command {
  constructor() {
    super({
      name: "pause",
      data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pausa a música atual"),
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    await queue.pause();
    const embed = new EmbedBuilder().setColor(client.cor).setAuthor({
      name: "| ⏹️ Pausada.",
      iconURL: interaction.user.displayAvatarURL(),
    });
    await interaction.reply({ embeds: [embed] });
  }
}
