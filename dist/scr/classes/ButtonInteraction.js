"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomButtonInteraction = void 0;
const enums_1 = require("../enums");
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const Base_1 = __importDefault(require("./Base"));
class CustomButtonInteraction extends Base_1.default {
    constructor(client, interaction) {
        super();
        this.interaction = interaction;
        this.client = client;
        this.guild = interaction.guild;
        this.channel = interaction.channel;
        this.user = interaction.user;
        this.message = interaction.message;
        this.customId = interaction.customId;
        this.member = interaction.member;
        this.queue = this.client.queues.get(this.guild.id);
    }
    main() {
        const { customId } = this;
        const isQueueComponent = Object.values(enums_1.queueComponents).includes(customId);
        if (isQueueComponent)
            this.mainQueueComponents();
    }
    async mainQueueComponents() {
        const { queue, customId } = this;
        const connection = queue?.getConnection();
        if (!queue)
            return this.message.delete().catch(() => { });
        if (queue.player._state.status == voice_1.AudioPlayerStatus.Idle ||
            // this.member.voice.channel != connection?.joinConfig.channelId ||
            queue.buttonOnHold())
            return;
        switch (customId) {
            case enums_1.queueComponents.pause:
                this.queuePause(queue);
                break;
            case enums_1.queueComponents.resume:
                this.queueResume(queue);
                break;
            case enums_1.queueComponents.queue:
                this.queueList(queue);
                break;
            case enums_1.queueComponents.clear:
                this.queueClear(queue);
                break;
            case enums_1.queueComponents.skip:
                this.queueSkip(queue);
                break;
            case enums_1.queueComponents.loop:
                this.queueLoop(queue);
                break;
            case enums_1.queueComponents.back:
                this.queueBack(queue);
                break;
            case enums_1.queueComponents.stop:
                this.queueStop(queue);
                break;
            case enums_1.queueComponents.shuffle:
                this.queueShuffle(queue);
                break;
            case enums_1.queueComponents.randomQueue:
                this.queueRandomQueue(queue);
                break;
        }
        queue.setLastClickButton();
    }
    async queueRandomQueue(queue) {
        queue.changeStateRandomQueue();
        this.interaction.update({ components: queue.getComponentsMessage() });
    }
    async queuePause(queue) {
        queue
            .pause()
            .then(() => this.interaction.update({ components: queue.getComponentsMessage() }))
            .catch((e) => this.client.embedError(this.interaction, e.message));
    }
    async queueShuffle(queue) {
        queue
            .shuffle()
            .then(() => {
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(this.client.cor)
                .setDescription("🔀 Queue embaralhada com sucesso.");
            this.interaction.reply({ embeds: [embed] });
        })
            .catch((e) => this.client.embedError(this.interaction, e.message));
    }
    async queueResume(queue) {
        queue
            .resume()
            .then(() => this.interaction.update({ components: queue.getComponentsMessage() }))
            .catch((e) => this.client.embedError(this.interaction, e.message));
    }
    async queueList(queue) {
        const { Utils: { secondsToText }, } = this;
        const { amountPerPage } = queue;
        const amountSongs = queue.songs.length - 1 == 0 ? 1 : queue.songs.length - 1;
        const pags = queue.songs.length - 1 < amountPerPage
            ? 1
            : Math.ceil((queue.songs.length - 1) / amountPerPage);
        const durationTotal = queue.getDurationTotal();
        const songsString = () => {
            const title = `${queue.getHeader()}\n\n`;
            const content = queue.songs
                .map((song, index) => `**${index}.** [${song.title}](${song.url}) [${song.durationFormatted}]`)
                .slice(1, amountPerPage + 1)
                .join("\n");
            return title + content;
        };
        const helpMsg = new discord_js_1.EmbedBuilder()
            .setColor(this.client.cor)
            .setDescription(songsString())
            .setAuthor({ name: `| 📑 Queue`, iconURL: this.user.displayAvatarURL() })
            .setFooter({
            text: `Músicas: ${amountSongs} | Pag's: 1/${pags} | Tempo: ${secondsToText(durationTotal)}`,
        });
        return this.interaction.reply({ embeds: [helpMsg], ephemeral: true });
    }
    async queueStop(queue) {
        await this.interaction.message.edit({ components: [] }).catch(() => { });
        queue.setMessageNull();
        queue.stop();
    }
    async queueBack(queue) {
        if (!queue.back)
            return this.client.embedError(this.interaction, "Não existe música para voltar");
        await this.interaction.message.edit({ components: [] }).catch(() => { });
        queue.setMessageNull();
        queue.playBackMusic();
    }
    async queueLoop(queue) {
        const statusLoop = queue.getStatusLoop();
        queue.resetLoops();
        if (statusLoop == 0)
            queue.loop();
        if (statusLoop == 1)
            queue.loopQueue();
        queue.addStatusLoop();
        this.interaction.update({ components: queue.getComponentsMessage() });
    }
    async queueClear(queue) {
        queue
            .clear()
            .then(() => {
            const embed = new discord_js_1.EmbedBuilder()
                .setAuthor({
                name: "| ✅ Queue Limpa",
                iconURL: this.user.displayAvatarURL(),
            })
                .setColor(this.client.cor);
            this.interaction.reply({ embeds: [embed] });
        })
            .catch((e) => this.client.embedError(this.interaction, e.message));
    }
    async queueSkip(queue) {
        await this.interaction.message.edit({ components: [] }).catch(() => { });
        queue.setMessageNull();
        queue.skip();
    }
}
exports.CustomButtonInteraction = CustomButtonInteraction;
