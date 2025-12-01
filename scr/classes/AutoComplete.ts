import {
  APIInteractionGuildMember,
  AutocompleteInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  User,
} from "discord.js";
import CustomClient from "./Client";

class Autocomplete {
  client: CustomClient;
  interaction: AutocompleteInteraction;
  user: User;
  member: GuildMember | APIInteractionGuildMember;
  guild: Guild;
  channel: GuildTextBasedChannel;
  options: any;

  constructor(client: CustomClient, interaction: AutocompleteInteraction) {
    this.client = client;
    this.interaction = interaction;
    this.user = interaction.user;
    this.member = interaction.member;
    this.options = interaction.options;
    this.guild = interaction.guild;
    this.channel = interaction.channel;
  }

  main() {
    const { name, value } = this.options.getFocused(true);

    switch (name) {
      case "songqueue":
        this.songsQueue(value);
        break;
    }
  }

  async songsQueue(value: string) {
    const queue = this.client.queues.get(this.guild.id);

    if (!queue || queue.songs.length == 1)
      return this.interaction.respond([
        {
          name: "Não existe queue ou músicas suficientes para completar esta ação.",
          value: 0,
        },
      ]);

    const songsFiltered = queue.songs
      .slice(1)
      .filter((song: any) =>
        song.title.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 25);

    await this.interaction.respond(
      songsFiltered.map((song: any) => ({
        name: song.title,
        value: queue.songs.indexOf(song),
      }))
    );
  }
}

export default Autocomplete;
