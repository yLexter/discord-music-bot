import {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  Colors,
} from "discord.js";
import channelConfig from "../jsons/config.json";
const { channelError } = channelConfig as any;

const configClient = {
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
};

class CustomClient extends Client {
  public commands = new Collection<string, any>();
  public cooldown = new Collection<string, number>();
  public queues = new Collection<string, any>();
  public cor = Colors.Red;
  public timeCooldown = 2.5;

  constructor() {
    super(configClient);
  }

  async startBot() {
    return super.login(process.env.TOKEN as string);
  }

  sendError(interaction: any, e: Error) {
    const { member, user, commandName } = interaction;
    const helpMsg = new EmbedBuilder()
      .setColor(this.cor)
      .setDescription(
        `**Comando => ${commandName}**\n\n` +
          "```js\n" +
          `- ${e.stack}\n` +
          "```"
      )
      .addFields([
        { name: "Guild", value: member.guild.name, inline: true },
        { name: "User", value: `<@${user.id}>`, inline: true },
      ]);
    return (this.channels.cache.get(channelError) as any)?.send({
      embeds: [helpMsg],
    });
  }

  embedError(interaction: any, error: string) {
    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`❌ ${error}`);

    console.log(error);

    if (interaction.deferred)
      return interaction.editReply({ embeds: [embed], ephemeral: true });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default CustomClient;
