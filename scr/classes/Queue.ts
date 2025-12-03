import {
  APIInteractionGuildMember,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  InteractionResponse,
  Message,
  User,
} from "discord.js";

import { Song, Playlist, SpotifySong, SpotifyPlaylist } from "./Songs";
import {
  AudioPlayer,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnection,
} from "@discordjs/voice";

import { queueComponents } from "../enums/index";
import CustomClient from "./Client";
import { Utils } from "./Utils";
import { PlayerSong } from "./player/Player";

export default class Queue {
  player: PlayerSong;

  member: GuildMember | APIInteractionGuildMember;
  guild: Guild;
  user: User;
  client: CustomClient;
  channel: GuildTextBasedChannel;
  songs: Song[] = [];
  loopingSong = false;
  loopingQueue: Song[] | false = false;
  back: Song | null = null;
  cor = Colors.Purple;
  message: Message | InteractionResponse | null = null;
  songPlay: number | null = null;
  minimumToUse = 3;
  statusLoop = 0;
  delayButton = 1;
  lastClickButton = 0;
  amountPerPage = 10;
  randomQueue = false;

  constructor(client: CustomClient, interaction: CommandInteraction) {
    this.client = client;
    this.member = interaction.member;
    this.guild = interaction.guild;
    this.user = interaction.user;
    this.channel = interaction.channel;
    this.message = interaction;
    this.player = new PlayerSong();
    this.setQueue();
  }

  getHeader(): string {
    const { songs } = this;
    return `🔊 **Tocando agora**\n[${songs[0].title}](${
      songs[0].url
    })\n${this.getProgressBar()}`;
  }

  getProgressBar(): string {
    const maximumProgessBar = 10;
    const progressBar = [...Array(maximumProgessBar)].map(() => "▬");
    const emoji = "🔵";
    const isPaused = this.player.state.status === AudioPlayerStatus.Paused;
    const song = this.songs[0];
    const songTime = isPaused
      ? Math.floor((this.songPlay || 0) / 1000)
      : Math.floor((Date.now() - (this.songPlay || 0)) / 1000);
    const positionProgressBar = Math.floor(
      songTime / (song.duration / (1000 * maximumProgessBar))
    );
    const emojiPlay = isPaused ? "▶️" : "⏸";
    progressBar.splice(positionProgressBar, 0, emoji);
    return `${progressBar.join("")}\n${emojiPlay}  ${Utils.secondsToText(
      songTime
    )}/${song.durationFormatted}`;
  }

  firstMusic(song: Song): void {
    if (this.loopingQueue) this.loopingQueue.push(song);

    this.songs.splice(1, 0, song);
  }

  async playPlaylist(
    playlist: Song[],
    interaction: CommandInteraction | null = null
  ) {
    if (this.loopingQueue)
      this.loopingQueue = this.loopingQueue.concat(playlist);

    if (this.songs.length) return (this.songs = this.songs.concat(playlist));

    this.songs = playlist;

    await this.playSong(playlist[0], interaction);
  }

  setQueue(): void {
    this.client.queues.set(this.guild.id, this);
  }

  async clear(): Promise<void> {
    if (this.songs.length <= 1)
      throw new Error("Só existe uma música na queue!");

    this.songs = this.songs.splice(0, 1);
  }

  removeSongLoopingQueue(songRemoved: Song): void {
    if (!this.loopingQueue) return;

    this.loopingQueue = this.loopingQueue.filter(
      (song) => song.id != songRemoved.id
    );
  }

  remove(position: number): Song {
    const songRemovida = this.songs[position];

    if (!songRemovida) throw new Error("A posição informada é invalida");

    this.songs.splice(position, 1);
    this.removeSongLoopingQueue(songRemovida);

    return songRemovida;
  }

  setLastClickButton(): void {
    this.lastClickButton = Date.now();
  }

  buttonOnHold(): boolean {
    return Date.now() - this.lastClickButton < this.delayButton * 1000;
  }

  getSongs(): Song[] {
    return this.songs;
  }

  async seek(seconds: number): Promise<void> {
    const song = this.songs[0];

    if (song.notSeekable)
      throw new Error("Essa música não suporta o avanço dinamâmico");

    if (seconds >= song.duration / 1000)
      throw new Error("Duração maior do que o vídeo.");

    this.player.seek(seconds * 1000);
    this.songPlay = Date.now() - seconds * 1000;
  }

  backMusic(): void {
    this.back = this.songs.shift();
  }

  async playBackMusic(): Promise<Song> {
    const back = this.back;

    if (!back) throw new Error("Não existe música para voltar");

    this.backMusic();
    this.songs.unshift(back);
    await this.playSong(back);

    return back;
  }

  loop(): boolean {
    return (this.loopingSong = !this.loopingSong);
  }

  loopQueue(): Song[] | false {
    if (this.loopingQueue) return (this.loopingQueue = false);

    return (this.loopingQueue = [...this.songs]);
  }

  move(oldPosition: number, newPosition: number): Song {
    const songMovida = this.songs.splice(oldPosition, 1)[0];

    this.songs.splice(newPosition, 0, songMovida);

    return songMovida;
  }

  async pause(): Promise<void> {
    this.player.pause();
    this.songPlay = Date.now() - (this.songPlay || 0);
  }

  async resume(): Promise<void> {
    this.player.resume();
    this.songPlay = Date.now() - (this.songPlay || 0);
  }

  addStatusLoop(): void {
    this.statusLoop++;
  }

  stop(): void {
    const connection = this.getConnection();
    const embed = new EmbedBuilder().setColor("Red").setAuthor({
      name: " | ⏹️ Stopped Queue.",
      iconURL: this.client.user.displayAvatarURL(),
    });

    this.client.queues.delete(this.guild.id);

    try {
      connection.destroy();
    } catch {}

    this.message?.edit?.({ components: [] }).catch(() => {});
    this.channel?.send({ embeds: [embed] }).catch(() => {});
  }

  skip() {
    if (this.loopingSong) return this.playSong(this.songs[0]);

    if (this.randomQueue && this.songs.length >= this.minimumToUse)
      return this.playRandomSong();

    this.backMusic();
    this.playSong(this.songs[0]);
  }

  async shuffle(): Promise<void> {
    const songs = this.getSongs();

    if (songs.length <= this.minimumToUse)
      throw new Error(
        `Músicas insuficientes na queue menor ou igual a ${this.minimumToUse}`
      );

    const firstMusic = songs.shift();

    // songs.shuffle();
    songs.unshift(firstMusic);
  }

  skipTo(position: number) {
    const musicSkip = this.songs[position];

    if (!musicSkip) throw new Error("A posição escolhida é invalida");

    if (this.loopingSong) return this.playSong(this.songs[0]);

    this.backMusic();
    this.songs.splice(position - 1, 1);
    this.songs.unshift(musicSkip);

    this.playSong(this.songs[0]);
    return musicSkip;
  }

  resetLoops(): void {
    this.loopingSong = false;
    this.loopingQueue = false;
  }

  joinChannelVoice(): VoiceConnection {
    const { member, guild } = this;

    return joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
  }

  play(song: Song | Song[], interaction?: CommandInteraction) {
    if (Array.isArray(song))
      return this.playPlaylist(song, interaction || null);

    if (this.loopingQueue && this.loopingQueue.some((x) => x.id == song.id)) {
      this.loopingQueue.push(song);
    }

    if (this.songs.length) {
      this.songs.push(song);
      const { user, songs, cor } = this as {
        user: User;
        songs: Song[];
        cor: number;
      };
      const embed = new EmbedBuilder()
        .setColor(cor)
        .setAuthor({
          name: `| 🎶 Adicionado a ${songs.length - 1}° posição da queue.`,
          iconURL: user.displayAvatarURL(),
        })
        .setDescription(
          `[${song.title}](${song.url}) [${song.durationFormatted}]`
        );

      if (interaction) return interaction.editReply({ embeds: [embed] });
      return this.channel.send({ embeds: [embed] });
    }

    this.songs.push(song);
    void this.playSong(song, interaction || null);
  }

  embedSong(song: Song): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.cor)
      .setDescription(
        `[${song.title}](${song.url}) [${song.durationFormatted}]`
      )
      .setAuthor({
        name: `| 🎶 Tocando Agora`,
        iconURL: this.user.displayAvatarURL(),
      });
  }

  getStatusLoop(): number {
    return this.statusLoop % 3;
  }

  getConnection(): VoiceConnection | undefined {
    return getVoiceConnection(this.guild.id);
  }

  getDurationTotal(): number {
    return this.songs.reduce((acc, song) => acc + song.duration, 0) / 1000;
  }

  setMessageNull(): void {
    this.message = null;
  }

  changeStateRandomQueue(): boolean {
    return (this.randomQueue = !this.randomQueue);
  }

  async playRandomSong(): Promise<void> {
    const songs = this.getSongs();
    const randomNumber = Math.floor(Math.random() * songs.length - 1) + 1;

    this.backMusic();
    this.move(randomNumber - 1, 0);
    this.playSong(songs[0]);
  }

  async sendMessage(song: Song): Promise<Message> {
    const embed = this.embedSong(song);

    return this.channel.send({
      embeds: [embed],
      components: this.getComponentsMessage(),
    });
  }

  async sendMessageError(error: string): Promise<void> {
    const { client } = this;
    const song = this.songs[0];

    if (!song) return;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: `| ${client.user.tag}`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTitle("Erro na Reprodução")
      .setDescription(
        `**Música:** [${song.title}](${song.url}) }\n**Motivo:** ${error}`
      );

    await this.channel.send({ embeds: [embed] }).catch(() => {});
  }

  async playSong(song: Song, interaction: CommandInteraction | null = null) {
    try {
      if (!song) return this.stop();

      this.player.play(song);
      this.songPlay = Date.now();

      if (interaction) {
        this.message = await interaction.editReply({
          embeds: [this.embedSong(song)],
          // components: this.getComponentsMessage(),
          // fetchReply: true,
        });
        return;
      }

      if (this.message && (this.message as any).edit)
        (this.message as any).edit({ components: [] }).catch(() => {});

      this.message = await this.sendMessage(song);
    } catch (e: any) {
      console.log(e);
      await this.sendMessageError(e.message);
      this.stop();
    }
  }

  getComponentsMessage() {
    const statusPlay = true;
    const statusLoop = this.getStatusLoop();

    const components = {
      type: 1,
      components: [
        {
          type: 2,
          label: `${statusPlay ? "Pause" : "Resume"}`,
          customId: `${
            statusPlay ? queueComponents.pause : queueComponents.resume
          }`,
          style: statusPlay ? 4 : 3,
          emoji: `${statusPlay ? "⏸" : "▶"}`,
        },
        {
          type: 2,
          label: "Skip",
          style: 1,
          custom_id: queueComponents.skip,
          emoji: "⏩",
        },
        {
          type: 2,
          label: `Shuffle`,
          style: 2,
          custom_id: queueComponents.shuffle,
          emoji: "🔀",
        },
        {
          type: 2,
          label: "Stop",
          style: 4,
          custom_id: queueComponents.stop,
          emoji: "⏹️",
        },
        {
          type: 2,
          label: "Queue",
          style: 2,
          custom_id: queueComponents.queue,
          emoji: "📝",
        },
      ],
    } as const;
    const components2 = {
      type: 1,
      components: [
        {
          type: 2,
          label: "Back",
          style: 1,
          custom_id: queueComponents.back,
          emoji: "⏪",
        },
        {
          type: 2,
          label: `Loop: ${
            !statusLoop ? "Off" : statusLoop == 1 ? "Song" : "Queue"
          }`,
          style: 2,
          custom_id: queueComponents.loop,
          emoji: "♾️",
        },
        {
          type: 2,
          label: `Clear`,
          style: 2,
          custom_id: queueComponents.clear,
          emoji: "🗑",
        },
        {
          type: 2,
          label: `Random Queue: ${this.randomQueue ? "On" : "Off"}`,
          style: this.randomQueue ? 3 : 4,
          custom_id: queueComponents.randomQueue,
          emoji: "🔀",
        },
      ],
    } as const;

    return [components, components2];
  }
}
