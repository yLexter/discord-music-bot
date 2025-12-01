import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class SeekCommand extends Command {
  constructor() {
    super({
      name: "seek",
      data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription(
          "Avança ou retrocede a música atual para um tempo (segundos)"
        )
        .addIntegerOption((opt) =>
          opt
            .setName("time")
            .setDescription("Tempo em segundos para ir")
            .setRequired(true)
            .setMinValue(0)
        ),
      help: "Pula para um tempo específico da música",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    const seconds = interaction.options.getInteger("time", true);
    if (seconds < 0) throw new Error("Tempo inválido.");
    const current = queue.songs[0];
    if (!current) throw new Error("Nenhuma música tocando");
    if (seconds > current.duration)
      throw new Error("Tempo maior que duração da música");
    await queue.seek(seconds);
    await interaction.reply({
      content: `Avançado para ${seconds}s da música atual.`,
    });
  }
}
