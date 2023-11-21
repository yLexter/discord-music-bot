const { languages } = require('../jsons/config.json')

class Autocomplete {
    constructor(client, interaction) {
        this.client = client
        this.interaction = interaction
        this.user = interaction.user
        this.member = interaction.member
        this.options = interaction.options
        this.guild = interaction.guild
        this.channel = interaction.channel
    }

    main() {
        const { name, value } = this.options.getFocused(true)

        switch (name) {
            case 'linguagem': this.translateText(value); break;
            case 'songqueue': this.songsQueue(value); break;
        }
    }

    async songsQueue(value) {
        const queue = this.client.queues.get(this.guild.id)

        if (!queue || queue.songs.length == 1)
            return this.interaction.respond([{ name: "Não existe queue ou músicas suficientes para completar esta ação.", value: 0 }])

        const songsFiltered = queue.songs
            .slice(1)
            .filter(song => song.title.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 25)

        await this.interaction.respond(
            songsFiltered.map(song => ({ name: song.title, value: queue.songs.indexOf(song) }))
        )

    }

    async translateText(value) {
        const arrayLanguages = Object.entries(languages)
        const filter = arrayLanguages
            .filter(([abbreviation, languages]) => languages.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 25)

        await this.interaction.respond(
            filter.map(([abbreviation, languages]) => ({ name: languages, value: abbreviation }))
        )
    }

}

module.exports = Autocomplete
