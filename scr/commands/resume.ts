import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class ResumeCommand extends Command {
  constructor() {
    super({
      name: "resume",
      data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Retoma a música atual caso esteja pausada"),
      help: "Retoma música pausada",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;

    if (!queue) return super.notQueue(interaction);

    queue.player.resume();

    await interaction.reply({ content: "Música retomada." });
  }
}
