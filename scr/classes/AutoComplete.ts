const { languages } = require("../jsons/config.json");

class Autocomplete {
  client: any;
  interaction: any;
  user: any;
  member: any;
  options: any;
  guild: any;
  channel: any;

  constructor(client: any, interaction: any) {
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
      case "linguagem":
        this.translateText(value);
        break;
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

  async translateText(value: string) {
    const arrayLanguages = Object.entries(languages);
    const filter = arrayLanguages
      .filter(([abbreviation, languages]: any) =>
        (languages as string).toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 25);

    await this.interaction.respond(
      filter.map(([abbreviation, languages]: any) => ({
        name: languages,
        value: abbreviation,
      }))
    );
  }
}

export = Autocomplete;
