import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class ClearCommand extends Command {
  constructor() {
    super({
      name: "clear",
      data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Limpa todas as músicas da queue"),
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    await queue.clear();
    const embed = new EmbedBuilder().setColor(client.cor).setAuthor({
      name: "| ✔️ Queue Limpa.",
      iconURL: interaction.user.displayAvatarURL(),
    });
    await interaction.reply({ embeds: [embed] });
  }
}
