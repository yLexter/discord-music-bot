import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class SkipToCommand extends Command {
  constructor() {
    super({
      name: "skipto",
      data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Pula para uma música específica pela posição na queue")
        .addIntegerOption((opt) =>
          opt
            .setName("songpos")
            .setDescription("Posição da música que deseja pular")
            .setRequired(true)
            .setMinValue(1)
        ),
      help: "Pula para música específica",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    const pos = interaction.options.getInteger("songpos", true);
    const target = queue.songs[pos];
    if (!target) throw new Error("Posição inválida");
    queue.skipTo(pos);
    await interaction.reply({ content: `Pulando para: ${target.title}` });
  }
}
