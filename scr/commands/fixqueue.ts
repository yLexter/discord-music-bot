import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class FixQueueCommand extends Command {
  constructor() {
    super({
      name: "fixqueue",
      data: new SlashCommandBuilder()
        .setName("fixqueue")
        .setDescription("Conserta a queue atual caso esteja bugada"),
      type: "admin",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    client.queues.delete(interaction.guild!.id);
    queue.stop();
  }
}
