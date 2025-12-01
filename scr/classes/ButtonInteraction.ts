import { queueComponents } from "../enums";
import {
  EmbedBuilder,
  Guild,
  User,
  GuildMember,
  TextBasedChannel,
  Message,
  ButtonInteraction,
  APIInteractionGuildMember,
} from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import Base from "./Base";
import CustomClient from "./Client";

export class CustomButtonInteraction extends Base {
  customId: string;
  interaction: ButtonInteraction;
  client: CustomClient;
  guild: Guild;
  channel: TextBasedChannel;
  user: User;
  message: Message;
  member: GuildMember | APIInteractionGuildMember;
  queue: any;

  constructor(client: CustomClient, interaction: ButtonInteraction) {
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
    const { customId } = this as any;
    const isQueueComponent = Object.values(queueComponents).includes(customId);

    if (isQueueComponent) this.mainQueueComponents();
  }

  async mainQueueComponents() {
    const { queue, customId } = this as any;
    const connection = queue?.getConnection();

    if (!queue) return this.message.delete().catch(() => {});

    if (
      queue.player._state.status == AudioPlayerStatus.Idle ||
      // this.member.voice.channel != connection?.joinConfig.channelId ||
      queue.buttonOnHold()
    )
      return;

    switch (customId) {
      case queueComponents.pause:
        this.queuePause(queue);
        break;
      case queueComponents.resume:
        this.queueResume(queue);
        break;
      case queueComponents.queue:
        this.queueList(queue);
        break;
      case queueComponents.clear:
        this.queueClear(queue);
        break;
      case queueComponents.skip:
        this.queueSkip(queue);
        break;
      case queueComponents.loop:
        this.queueLoop(queue);
        break;
      case queueComponents.back:
        this.queueBack(queue);
        break;
      case queueComponents.stop:
        this.queueStop(queue);
        break;
      case queueComponents.shuffle:
        this.queueShuffle(queue);
        break;
      case queueComponents.randomQueue:
        this.queueRandomQueue(queue);
        break;
    }

    queue.setLastClickButton();
  }

  async queueRandomQueue(queue: any) {
    queue.changeStateRandomQueue();
    this.interaction.update({ components: queue.getComponentsMessage() });
  }

  async queuePause(queue: any) {
    queue
      .pause()
      .then(() =>
        this.interaction.update({ components: queue.getComponentsMessage() })
      )
      .catch((e: any) => this.client.embedError(this.interaction, e.message));
  }

  async queueShuffle(queue: any) {
    queue
      .shuffle()
      .then(() => {
        const embed = new EmbedBuilder()
          .setColor(this.client.cor)
          .setDescription("🔀 Queue embaralhada com sucesso.");
        this.interaction.reply({ embeds: [embed] });
      })
      .catch((e: any) => this.client.embedError(this.interaction, e.message));
  }

  async queueResume(queue: any) {
    queue
      .resume()
      .then(() =>
        this.interaction.update({ components: queue.getComponentsMessage() })
      )
      .catch((e: any) => this.client.embedError(this.interaction, e.message));
  }

  async queueList(queue: any) {
    const {
      Utils: { secondsToText },
    } = this as any;
    const { amountPerPage } = queue;
    const amountSongs =
      queue.songs.length - 1 == 0 ? 1 : queue.songs.length - 1;
    const pags =
      queue.songs.length - 1 < amountPerPage
        ? 1
        : Math.ceil((queue.songs.length - 1) / amountPerPage);
    const durationTotal = queue.getDurationTotal();

    const songsString = () => {
      const title = `${queue.getHeader()}\n\n`;
      const content = queue.songs
        .map(
          (song: any, index: number) =>
            `**${index}.** [${song.title}](${song.url}) [${song.durationFormatted}]`
        )
        .slice(1, amountPerPage + 1)
        .join("\n");
      return title + content;
    };

    const helpMsg = new EmbedBuilder()
      .setColor(this.client.cor)
      .setDescription(songsString())
      .setAuthor({ name: `| 📑 Queue`, iconURL: this.user.displayAvatarURL() })
      .setFooter({
        text: `Músicas: ${amountSongs} | Pag's: 1/${pags} | Tempo: ${secondsToText(
          durationTotal
        )}`,
      });
    return this.interaction.reply({ embeds: [helpMsg], ephemeral: true });
  }

  async queueStop(queue: any) {
    await this.interaction.message.edit({ components: [] }).catch(() => {});
    queue.setMessageNull();
    queue.stop();
  }

  async queueBack(queue: any) {
    if (!queue.back)
      return this.client.embedError(
        this.interaction,
        "Não existe música para voltar"
      );

    await this.interaction.message.edit({ components: [] }).catch(() => {});
    queue.setMessageNull();
    queue.playBackMusic();
  }

  async queueLoop(queue: any) {
    const statusLoop = queue.getStatusLoop();

    queue.resetLoops();

    if (statusLoop == 0) queue.loop();
    if (statusLoop == 1) queue.loopQueue();

    queue.addStatusLoop();

    this.interaction.update({ components: queue.getComponentsMessage() });
  }

  async queueClear(queue: any) {
    queue
      .clear()
      .then(() => {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: "| ✅ Queue Limpa",
            iconURL: this.user.displayAvatarURL(),
          })
          .setColor(this.client.cor);
        this.interaction.reply({ embeds: [embed] });
      })
      .catch((e: any) => this.client.embedError(this.interaction, e.message));
  }

  async queueSkip(queue: any) {
    await this.interaction.message.edit({ components: [] }).catch(() => {});
    queue.setMessageNull();
    queue.skip();
  }
}
