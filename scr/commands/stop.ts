import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class StopCommand extends Command {
  constructor() {
    super({
      name: "stop",
      data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Para a música e limpa a fila"),
      help: "Para reprodução e limpa queue",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) super.notQueue(interaction);
    queue.stop();
    await interaction.reply({ content: "Fila parada e limpa." });
  }
}
