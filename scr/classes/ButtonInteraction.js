const { queueComponents, geral } = require("../enums")
const { EmbedBuilder } = require('discord.js')
const { AudioPlayerStatus } = require('@discordjs/voice')
const Base = require("./Base")

module.exports = class extends Base {
    constructor(client, interaction) {
        super()
        this.interaction = interaction
        this.client = client
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.user = interaction.user
        this.message = interaction.message
        this.customId = interaction.customId
        this.member = interaction.member
        this.queue = this.client.queues.get(this.guild.id)
    }

    main() {
        const { customId } = this
        const isQueueComponent = Object.values(queueComponents).includes(customId)

        if (isQueueComponent)
            return this.mainQueueComponents();

        return this.generalInteraction()
    }

    generalInteraction() {

        const { customId } = this

        switch (customId) {
            case geral.restartBot: this.restartBot(); break;
            case geral.stopBot: this.stopBot(); break;
            case geral.translateLyrics: this.traslateLyrics(); break;
        }
    }

    async restartBot() {

        await this.interaction.update({
            content: `Reiniciando bot...`,
            embeds: [],
            components: []
        })

        return this.SquareApi.restartApp()
    }

    async stopBot() {

        await this.interaction.update({
            content: `Parando bot...`,
            embeds: [],
            components: []
        })

        return this.SquareApi.stopApp()
    }

    async traslateLyrics() {
        const embed = this.message.embeds[0]
        const text = await this.translateText(embed.description, "pt") || "Não foi possivel traduzir o texto"

        embed.description = text

        this.interaction.update({
            embeds: [embed],
            components: []
        })
    }

    mainQueueComponents() {
        const { queue, customId } = this
        const connection = queue?.getConnection()

        if (!queue)
            return this.message.delete().catch(() => { });

        if (queue.player._state.status == AudioPlayerStatus.Idle || (this.member.voice.channel != connection?.joinConfig.channelId || queue.buttonOnHold()))
            return;

        switch (customId) {
            case queueComponents.pause: this.queuePause(queue); break;
            case queueComponents.resume: this.queueResume(queue); break;
            case queueComponents.queue: this.queueList(queue); break;
            case queueComponents.clear: this.queueClear(queue); break;
            case queueComponents.skip: this.queueSkip(queue); break;
            case queueComponents.loop: this.queueLoop(queue); break;
            case queueComponents.back: this.queueBack(queue); break;
            case queueComponents.stop: this.queueStop(queue); break;
            case queueComponents.shuffle: this.queueShuffle(queue); break;
            case queueComponents.randomQueue: this.queueRandomQueue(queue); break;
        }

        queue.setLastClickButton()
    }

    queueRandomQueue(queue) {
        queue.changeStateRandomQueue()
        this.interaction.update({ components: queue.getComponentsMessage() })
    }

    async queuePause(queue) {
        queue.pause()
            .then(() => this.interaction.update({ components: queue.getComponentsMessage() }))
            .catch(e => this.client.embedError(this.interaction, e.message))
    }

    async queueShuffle(queue) {
        queue.shuffle()
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor(this.client.cor)
                    .setDescription("🔀 Queue embaralhada com sucesso.")
                this.interaction.reply({ embeds: [embed] })
            })
            .catch(e => this.client.embedError(this.interaction, e.message))
    }

    async queueResume(queue) {
        queue.resume()
            .then(() => this.interaction.update({ components: queue.getComponentsMessage() }))
            .catch(e => this.client.embedError(this.interaction, e.message))
    }

    async queueList(queue) {
        const { Utils: { secondsToText } } = this
        const { amountPerPage } = queue
        const amountSongs = queue.songs.length - 1 == 0 ? 1 : queue.songs.length - 1
        const pags = queue.songs.length - 1 < amountPerPage ? 1 : Math.ceil((queue.songs.length - 1) / amountPerPage)
        const durationTotal = queue.getDurationTotal()

        const songsString = () => {
            const title = `${queue.getHeader()}\n\n`
            const content = queue.songs
                .map((song, index) => `**${index}.** [${song.title}](${song.url}) [${song.durationFormatted}]`)
                .slice(1, amountPerPage + 1)
                .join("\n")
            return title + content
        }

        const helpMsg = new EmbedBuilder()
            .setColor(this.client.cor)
            .setDescription(songsString())
            .setAuthor({ name: `| 📑 Queue`, iconURL: this.user.displayAvatarURL() })
            .setFooter({ text: `Músicas: ${amountSongs} | Pag's: 1/${pags} | Tempo: ${secondsToText(durationTotal)}` })
        return this.interaction.reply({ embeds: [helpMsg], ephemeral: true })
    }

    async queueStop(queue) {
        await this.interaction.message.edit({ components: [] }).catch(() => { })
        queue.setMessageNull()
        queue.stop()
    }

    async queueBack(queue) {
        if (!queue.back)
            return this.client.embedError(this.interaction, "Não existe música para voltar")

        await this.interaction.message.edit({ components: [] }).catch(() => { })
        queue.setMessageNull()
        queue.playBackMusic()
    }

    async queueLoop(queue) {
        const statusLoop = queue.getStatusLoop()

        queue.resetLoops()

        if (statusLoop == 0) queue.loop()
        if (statusLoop == 1) queue.loopQueue()

        queue.addStatusLoop()

        this.interaction.update({ components: queue.getComponentsMessage() })
    }

    async queueClear(queue) {
        queue.clear()
            .then(() => {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: '| ✅ Queue Limpa', iconURL: this.user.displayAvatarURL() })
                    .setColor(this.client.cor)
                this.interaction.reply({ embeds: [embed] })
            })
            .catch(e => this.client.embedError(this.interaction, e.message))
    }

    async queueSkip(queue) {
        await this.interaction.message.edit({ components: [] }).catch(() => { })
        queue.setMessageNull()
        queue.skip()
    }
}