import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: "eval",
      data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Executa comandos como caller")
        .addStringOption((opt) =>
          opt
            .setName("comando")
            .setDescription("Digite o comando para executar")
            .setRequired(true)
        ),
      type: "owner",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const comando = interaction.options.getString("comando", true);
    try {
      // eslint-disable-next-line no-eval
      const resultadoOk = await eval(`(async () => { return ${comando}})()`);
      const resultado = JSON.stringify(resultadoOk, null, "\t")?.substring(
        0,
        3000
      );
      const embed = new EmbedBuilder()
        .setColor(client.cor)
        .setDescription(
          `📥 **Entrada**\n\n\`\`\`txt\n${comando}\n\`\`\`\n\n📤 **Saída**\n\n\`\`\`txt\n${resultado}\n\`\`\``
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (e) {
      const embed = new EmbedBuilder()
        .setColor(client.cor)
        .setDescription(
          `📥 **Entrada**\n\n\`\`\`txt\n${comando}\n\`\`\`\n\n📤 **Saída**\n\n\`\`\`js\n- ${
            (e as Error).stack
          }\n\`\`\``
        );
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}
