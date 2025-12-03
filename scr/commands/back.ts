import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class BackCommand extends Command {
  constructor() {
    super({
      name: "back",
      data: new SlashCommandBuilder()
        .setName("back")
        .setDescription("Volta a tocar a música anterior"),
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id);
    if (!queue) return super.notQueue(interaction);
    await queue.playBackMusic();
  }
}
