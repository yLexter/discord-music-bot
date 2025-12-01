import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class RandomQueueCommand extends Command {
  constructor() {
    super({
      name: "randomqueue",
      data: new SlashCommandBuilder()
        .setName("randomqueue")
        .setDescription(
          "Coloca as músicas em posições aleatórias dentro da queue"
        ),
      help: "Embaralha as músicas da queue",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    if (queue.songs.length <= 2)
      throw new Error("Quantidade insuficiente de músicas para randomização");
    const originalLength = queue.songs.length - 1;
    queue.songs = [queue.songs[0]]
      .concat
      // queue.songs.slice(1).shuffle()
      () as any; // first stays
    if (originalLength !== queue.songs.length - 1)
      throw new Error("Erro ao randomizar a fila");
    await interaction.reply({ content: "Queue embaralhada com sucesso." });
  }
}
