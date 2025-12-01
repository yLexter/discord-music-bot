import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class SkipCommand extends Command {
  constructor() {
    super({
      name: "skip",
      data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Pula a música atual"),
      help: "Pula música atual",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    await queue.skip();
    await interaction.reply({ content: "Música pulada." });
  }
}
