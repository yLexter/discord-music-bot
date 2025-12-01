import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";

export default class GetSongsCommand extends Command {
  constructor() {
    super({
      name: "getsongs",
      data: new SlashCommandBuilder()
        .setName("getsongs")
        .setDescription("Backup do arquivo de músicas"),
      type: "owner",
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const { DatabaseSongs } = this;
    const json = await DatabaseSongs.getObjectJson();
    const stringJson = JSON.stringify(json, null, 2);
    const file = new AttachmentBuilder(Buffer.from(stringJson), {
      name: "spotifySongs.json",
    });
    await interaction.reply({ files: [file] });
  }
}
