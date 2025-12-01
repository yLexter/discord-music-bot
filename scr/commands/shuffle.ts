import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class ShuffleCommand extends Command {
  constructor() {
    super({
      name: "shuffle",
      data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Embaralha as músicas da fila mantendo a atual"),
      help: "Embaralha músicas da queue",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    if (queue.songs.length <= 2)
      throw new Error("É necessário mais de 2 músicas para embaralhar");
    queue.shuffle();
    await interaction.reply({ content: "Queue embaralhada." });
  }
}
