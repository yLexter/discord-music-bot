import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../classes/Command";
import Client from "../classes/Client";
import Queue from "../classes/Queue";
import { songType } from "../enums";

export default class PlayCommand extends Command {
  constructor() {
    super({
      name: "play",
      data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Toca uma música desejada")
        .addStringOption((opt) =>
          opt
            .setName("search")
            .setDescription("Informe uma música para tocar")
            .setRequired(true)
        ),
      type: "music",
      cooldown: 3,
    });
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString("search", true);
    try {
      await interaction.deferReply();
      if (!interaction.member.voice.channel)
        throw new Error("Você precisa entrar em um canal de voz primeiro.");
      const queue =
        (client.queues.get(interaction.guild!.id) as Queue | undefined) ||
        new Queue(client, interaction);
      const data = await Queue.songSearch(query, interaction);
      const handlers: Record<string, () => Promise<void>> = {
        [songType.track]: async () => queue.play(data, interaction),
        [songType.playlist]: async () => {
          const {
            playlist,
            owner,
            songs,
            totalSongs,
            durationFormatted,
            images,
            color,
          } = data as any;
          const embedPlaylist = new EmbedBuilder()
            .setColor(color || client.cor)
            .setDescription(
              `🅿️ **Playlist: [${playlist.name}](${playlist.url})\n🆔 Autor: [${owner.name}](${owner.url})\n📑 Total: ${totalSongs}\n🕑 Duração: ${durationFormatted}**`
            )
            .setAuthor({
              name: "| 🎶 Playlist adicionada",
              iconURL: interaction.user.displayAvatarURL(),
            });
          if (images) embedPlaylist.setThumbnail(images);
          await interaction.editReply({ embeds: [embedPlaylist] });
          queue.play(songs);
        },
      };
      await handlers[(data as any).type]();
    } catch (e) {
      await interaction
        .editReply({ content: `Error => ${(e as Error).message}` })
        .catch(() => {});
      client.queues.delete(interaction.guild!.id);
    }
  }
}
