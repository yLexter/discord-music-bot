import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class RemoveCommand extends Command {
  constructor() {
    super({
      name: "remove",
      data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove uma música da queue pela posição")
        .addIntegerOption((opt) =>
          opt
            .setName("songpos")
            .setDescription("Selecione a posição da música")
            .setRequired(true)
            .setMinValue(1)
        ),
      help: "Remove música específica da queue",
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    const pos = interaction.options.getInteger("songpos", true);
    if (pos === 0)
      throw new Error("Não é possível remover a música atual com este comando");
    const music = queue.songs[pos];
    if (!music) throw new Error("Posição inválida para remoção");
    queue.remove(pos);
    await interaction.reply({ content: `Música removida: ${music.title}` });
  }
}
