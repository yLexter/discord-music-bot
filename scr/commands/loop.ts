import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";

export default class LoopCommand extends Command {
  constructor() {
    super({
      name: "loop",
      data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Opções de loop")
        .addSubcommand((sub) =>
          sub.setName("song").setDescription("Coloca uma música em loop")
        )
        .addSubcommand((sub) =>
          sub.setName("queue").setDescription("Coloca a queue atual em loop")
        )
        .addSubcommand((sub) =>
          sub.setName("reset").setDescription("Desativa os loops da queue")
        ),
      type: "music",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const queue = client.queues.get(interaction.guild!.id) as Queue | undefined;
    if (!queue) return super.notQueue(interaction);
    const sub = interaction.options.getSubcommand();
    const handlers: Record<string, () => Promise<void>> = {
      song: async () => {
        const currentLoop = queue.loop() ? "ativado" : "desativado";
        const embed = new EmbedBuilder().setColor(client.cor).setAuthor({
          name: `| ♾️ Loop de song ${currentLoop} com sucesso.`,
          iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
      },
      queue: async () => {
        const currentLoop = queue.loopQueue() ? "ativado" : "desativado";
        const embed = new EmbedBuilder().setColor(client.cor).setAuthor({
          name: `| ♾️ Loop de queue ${currentLoop} com sucesso.`,
          iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
      },
      reset: async () => {
        queue.resetLoops();
        const embed = new EmbedBuilder().setColor(client.cor).setAuthor({
          name: `| ♾️ Loop desativado com sucesso.`,
          iconURL: interaction.user.displayAvatarURL(),
        });
        await interaction.reply({ embeds: [embed] });
      },
    };
    await handlers[sub]();
  }
}
