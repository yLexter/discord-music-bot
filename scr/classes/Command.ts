import { EmbedBuilder } from "discord.js";
import Base from "./Base";

class Command extends Base {
  public name: string;
  public data: any;
  public type: string;
  public cooldown: number;
  public cor: string;

  constructor(options: any) {
    super();
    this.name = options.name;
    this.data = options.data;
    this.type = options.type;
    this.cooldown = options.cooldown || 2;
    this.cor = options.cor || "RANDOM";
  }

  notQueue(interaction: any) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`❌ Não existe uma queue ativa no servidor`);

    if (interaction.deferred)
      return interaction.editReply({ embeds: [embed], ephemeral: true });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  sucessMessage(interaction: any, message: string) {
    const embed = new EmbedBuilder()
      .setDescription(`✅ ${message}`)
      .setColor("Green");

    if (interaction.deferred)
      return interaction.editReply({ embeds: [embed], ephemeral: true });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default Command;
