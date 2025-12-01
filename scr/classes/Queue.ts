import { EmbedBuilder } from "discord.js";
import YouTubeLib from "youtube-sr";

const YouTube = YouTubeLib || (YouTubeLib as any);
const { Song, Playlist, SpotifySong, SpotifyPlaylist } = require("./Songs");
const { secondsToText } = require("./Utils");
import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  getVoiceConnection,
} from "@discordjs/voice";

const { queueComponents } = require("../enums/index");
const play = require("play-dl");
const fetch = require("isomorphic-unfetch");
const { getData } = require("spotify-url-info")(fetch);
const DatabaseSongs = require("./DatabaseSongs");
const { songType } = require("../enums/index");

class Queue {
  member: any;
  guild: any;
  user: any;
  client: any;
  channel: any;
  songs: any[] = [];
  loopingSong = false;
  loopingQueue: any[] | false = false;
  back: any = null;
  songPlay: number | null = null;
  message: any = null;
  cor = "#4B0082";
  minimumToUse = 3;
  statusLoop = 0;
  delayButton = 1;
  lastClickButton = 0;
  amountPerPage = 10;
  randomQueue = false;
  player: any;

  constructor(client: any, interaction: any) {
    this.member = interaction.member;
    this.guild = interaction.guild;
    this.user = interaction.user;
    this.client = client;
    this.channel = interaction.channel;
    this.player = this.getPlayer();
    this.setQueue();
    this.setListeners();
  }

  getHeader() {
    const { songs } = this;
    return `🔊 **Tocando agora**\n[${songs[0].title}](${
      songs[0].url
    })\n${this.getProgressBar()}`;
  }

  getProgressBar() {
    const maximumProgessBar = 10;
    const progressBar = [...Array(maximumProgessBar)].map(() => "▬");
    const emoji = "🔵";
    const isPaused = this.player._state.status == AudioPlayerStatus.Paused;
    const song = this.songs[0];
    const songTime = isPaused
      ? Math.floor((this.songPlay || 0) / 1000)
      : Math.floor((Date.now() - (this.songPlay || 0)) / 1000);
    const positionProgressBar = Math.floor(
      songTime / (song.duration / (1000 * maximumProgessBar))
    );
    const emojiPlay = isPaused ? "▶️" : "⏸";
    progressBar.splice(positionProgressBar, 0, emoji);
    return `${progressBar.join("")}\n${emojiPlay}  ${secondsToText(songTime)}/${
      song.durationFormatted
    }`;
  }

  firstMusic(song: any) {
    if (this.loopingQueue) (this.loopingQueue as any[]).push(song);

    this.songs.splice(1, 0, song);
  }

  async playPlaylist(playlist: any[], interaction: any = null) {
    if (this.loopingQueue)
      this.loopingQueue = (this.loopingQueue as any[]).concat(playlist);

    if (this.songs.length) return (this.songs = this.songs.concat(playlist));

    this.songs = playlist;
    this.playSong(playlist[0], interaction);
  }

  setQueue() {
    this.client.queues.set(this.guild.id, this);
  }

  async clear() {
    if (this.songs.length <= 1)
      throw new Error("Só existe uma música na queue!");

    this.songs = this.songs.splice(0, 1);
  }

  removeSongLoopingQueue(songRemoved: any) {
    if (!this.loopingQueue) return;

    this.loopingQueue = (this.loopingQueue as any[]).filter(
      (song) => song.id != songRemoved.id
    );
  }

  remove(position: number) {
    const songRemovida = this.songs[position];

    if (!songRemovida) throw new Error("A posição informada é invalida");

    this.songs.splice(position, 1);
    this.removeSongLoopingQueue(songRemovida);

    return songRemovida;
  }

  setLastClickButton() {
    this.lastClickButton = Date.now();
  }

  buttonOnHold() {
    return Date.now() - this.lastClickButton < this.delayButton * 1000;
  }

  getSongs() {
    return this.songs;
  }

  async seek(seconds: number) {
    const song = this.songs[0];

    if (song.notSeekable)
      throw new Error("Essa música não suporta o avanço dinamâmico");

    if (seconds >= song.duration / 1000)
      throw new Error("Duração maior do que o vídeo.");

    const stream = await play.stream(song.id, { seek: seconds });
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    const connection = this.getConnection();

    this.player.play(resource);
    connection.subscribe(this.player);
    this.songPlay = Date.now() - seconds * 1000;
  }

  backMusic() {
    this.back = this.songs.shift();
  }

  async playBackMusic() {
    const back = this.back;

    if (!back) throw new Error("Não existe música para voltar");

    this.backMusic();
    this.songs.unshift(back);
    this.playSong(back);

    return back;
  }

  loop() {
    return (this.loopingSong = !this.loopingSong);
  }

  loopQueue() {
    if (this.loopingQueue) return (this.loopingQueue = false);

    return (this.loopingQueue = [...this.songs]);
  }

  move(oldPosition: number, newPosition: number) {
    const songMovida = this.songs.splice(oldPosition, 1)[0];

    this.songs.splice(newPosition, 0, songMovida);

    return songMovida;
  }

  async pause() {
    if (this.player._state.status == AudioPlayerStatus.Paused)
      throw new Error("Música já está pausada.");

    this.player.pause();
    this.songPlay = Date.now() - (this.songPlay || 0);
  }

  async resume() {
    if (this.player._state.status == AudioPlayerStatus.Playing)
      throw new Error("Música já está tocando.");

    this.player.unpause();
    this.songPlay = Date.now() - (this.songPlay || 0);
  }

  addStatusLoop() {
    this.statusLoop++;
  }

  stop() {
    const { client, guild, player } = this as any;
    const connection = this.getConnection();
    const embed = new EmbedBuilder().setColor("Red").setAuthor({
      name: " | ⏹️ Stopped Queue.",
      iconURL: client.user.displayAvatarURL(),
    });

    client.queues.delete(guild.id);
    player.removeAllListeners(AudioPlayerStatus.Idle);
    player.removeAllListeners("error");

    try {
      connection?.destroy()?.catch(() => {});
    } catch {}
    this.message?.edit({ components: [] }).catch(() => {});
    this.channel?.send({ embeds: [embed] }).catch(() => {});
  }

  skip() {
    if (this.loopingSong) return this.playSong(this.songs[0]);

    if (this.randomQueue && this.songs.length >= this.minimumToUse)
      return this.playRandomSong();

    this.backMusic();
    this.playSong(this.songs[0]);
  }

  async shuffle() {
    const songs = this.getSongs();

    if (songs.length <= this.minimumToUse)
      throw new Error(
        `Músicas insuficientes na queue menor ou igual a ${this.minimumToUse}`
      );

    const firstMusic = songs.shift();

    (songs as any).shuffle();
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

  resetLoops() {
    this.loopingSong = false;
    this.loopingQueue = false;
  }

  joinChannelVoice() {
    const { member, guild } = this as any;

    return joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
  }

  play(song: any, interaction?: any) {
    if (Array.isArray(song))
      return this.playPlaylist(song, interaction || null);

    if (
      this.loopingQueue &&
      !(this.loopingQueue as any[]).some((x) => x.id == song.id)
    )
      (this.loopingQueue as any[]).push(song);

    if (this.songs.length) {
      this.songs.push(song);
      const { user, songs, cor } = this as any;
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
    this.playSong(song, interaction || null);
  }

  embedSong(song: any) {
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

  getStatusLoop() {
    return this.statusLoop % 3;
  }

  getPlayer() {
    return createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });
  }

  getConnection() {
    return getVoiceConnection(this.guild.id);
  }

  getDurationTotal() {
    return this.songs.reduce((acc, song) => acc + song.duration, 0) / 1000;
  }

  setMessageNull() {
    this.message = null;
  }

  changeStateRandomQueue() {
    return (this.randomQueue = !this.randomQueue);
  }

  async playRandomSong() {
    const songs = this.getSongs();
    const randomNumber = Math.floor(Math.random() * songs.length - 1) + 1;

    this.backMusic();
    this.move(randomNumber - 1, 0);
    this.playSong(songs[0]);
  }

  async sendMessage(song: any) {
    const embed = this.embedSong(song);

    return this.channel.send({
      embeds: [embed],
      components: this.getComponentsMessage(),
    });
  }

  async sendMessageError(error: string) {
    const { client } = this as any;
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

    return this.channel.send({ embeds: [embed] }).catch(() => {});
  }

  setListeners() {
    this.player.on(AudioPlayerStatus.Idle, async () => {
      const songs = this.getSongs();

      if (this.loopingSong) return this.playSong(songs[0]);

      if (this.randomQueue && this.songs.length >= this.minimumToUse)
        return this.playRandomSong();

      this.backMusic();
      this.playSong(songs[0]);
    });

    this.player.on("error", async (e: any) => {
      await this.sendMessageError(e.message);
      this.stop();
      console.log(e);
    });
  }

  async playSong(song: any, interaction: any = null) {
    try {
      if (!song) return this.stop();

      const { player } = this as any;
      const connection = this.getConnection() || this.joinChannelVoice();
      const stream = await play.stream(song.id, {
        discordPlayerCompatibility: true,
      });
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      if (this.loopingQueue && this.songs.length == 1) {
        const filtered = (this.loopingQueue as any[]).filter(
          (x) => x.id != this.songs[0]?.id
        );
        this.songs = this.songs.concat(filtered);
      }

      player.play(resource);
      connection.subscribe(player);
      this.songPlay = Date.now();

      if (interaction) {
        return (this.message = await interaction.editReply({
          embeds: [this.embedSong(song)],
          components: this.getComponentsMessage(),
          fetchReply: true,
        }));
      }

      if (this.message) this.message.edit({ components: [] }).catch(() => {});

      this.message = await this.sendMessage(song);
    } catch (e: any) {
      console.log(e);
      await this.sendMessageError(e.message);
      this.stop();
    }
  }

  static async songSearch(query: string, interaction?: any) {
    const isSpotifyUrl = (query as any).isUrlSpotify?.() || false;
    const isUrlSoundcloud = (query as any).isUrlSoundcloud?.() || false;
    const isYoutubePlaylist = (query as any).isUrlYoutubePlaylist?.() || false;

    return isSpotifyUrl
      ? await spotifySearch()
      : isUrlSoundcloud
      ? await soundCloudSearch()
      : isYoutubePlaylist
      ? await ytPlaylistSearch()
      : await ytVideoSearch();

    async function soundCloudSearch() {
      const data = await play.soundcloud(query);
      const { type, name, url, durationInMs, durationInSec, user } = data;

      const typesData: any = {
        [songType.track]: () => {
          return new Song({
            id: url,
            title: name,
            url: query,
            duration: durationInMs,
            durationFormatted: secondsToText(durationInSec),
            notSeekable: true,
          });
        },
        [songType.playlist]: async () => {
          const songs = (await (data as any).all_tracks()).map((song: any) => {
            const { id, name, durationInMs } = song;
            return new Song({
              id: `https://api.soundcloud.com/tracks/${id}`,
              title: name,
              url: query,
              duration: durationInMs,
              durationFormatted: secondsToText(durationInMs / 1000),
              notSeekable: true,
            });
          });

          return new Playlist({
            name: name,
            url: query,
            ownerName: user?.name,
            ownerUrl: user?.url,
            songs: songs,
            durationPlaylist: durationInMs,
          });
        },
      };

      return typesData[type]();
    }

    async function ytVideoSearch() {
      let song: any;

      if (query.includes("youtube.com/watch?")) {
        song = await YouTube.getVideo(query);
      } else {
        const busca = await search_yt(query);

        if (!busca) throw new Error("Música não encontrada");

        song = busca;
      }

      const { id, url, duration, durationFormatted, title } = song;

      return new Song({
        id: id,
        title: title,
        url: url,
        duration: duration,
        durationFormatted: durationFormatted,
      });
    }

    async function ytPlaylistSearch() {
      const playlist = await play.playlist_info(query);
      const songs = playlist.videos.map((song: any) => {
        const { id, url, title, durationRaw, durationInSec } = song;

        return new Song({
          id: id,
          title: title,
          url: url,
          duration: durationInSec * 1000,
          durationFormatted: durationRaw,
        });
      });

      const { title, channel, url } = playlist as any;
      const durationPlaylist = songs.reduce(
        (acc: number, song: any) => acc + song.duration,
        0
      );

      return new Playlist({
        name: title,
        url: url,
        ownerName: channel?.name,
        ownerUrl: channel?.url,
        songs: songs,
        durationPlaylist: durationPlaylist,
      });
    }

    async function spotifySearch() {
      const infoSpotify = await getData(query);
      const spotifyTypes: any = {
        [songType.track]: async () => {
          const song = infoSpotify;

          const searchedSong = await DatabaseSongs.searchSong(song);

          if (searchedSong) return searchedSong;

          const queryStr = `${song.name} - ${
            song?.artists?.map((a: any) => a.name).join(" ") || ""
          }`;
          const msc = await search_yt(queryStr);

          if (!msc) throw new Error("Música não Encontrada.");

          const { title, uri } = song as any;

          const data = new SpotifySong({
            id: msc.id,
            title: title,
            uri: uri,
            duration: msc.duration,
            durationFormatted: secondsToText(msc.duration / 1000),
          });

          await DatabaseSongs.addSong(data.toJSON());
          await DatabaseSongs.sortArray();

          return data;
        },
        [songType.playlist]: async () => {
          const {
            name,
            subtitle,
            coverArt: { extractedColors, sources },
            id,
            trackList,
          } = infoSpotify as any;
          const songsSpotify: any[] = [];
          const songsNotInDatabase: any[] = [];

          for await (const song of trackList) {
            const searchedSong = await DatabaseSongs.searchSong(song);

            if (searchedSong) {
              songsSpotify.push(searchedSong);
            } else {
              const { title, subtitle, uri } = song as any;
              const query = `${title} - ${subtitle}`;
              const ytSong = await search_yt(query);

              if (!ytSong) continue;

              const data = new SpotifySong({
                id: ytSong.id,
                title: title,
                uri: uri,
                duration: ytSong.duration,
                durationFormatted: secondsToText(ytSong.duration / 1000),
              });

              songsSpotify.push(data);
              songsNotInDatabase.push(data.toJSON());
            }
          }

          const durationTotal = songsSpotify.reduce(
            (acc, song) => acc + song.duration,
            0
          );

          if (songsNotInDatabase.length) {
            await DatabaseSongs.addSong(songsNotInDatabase);
            await DatabaseSongs.sortArray();
          }

          return new SpotifyPlaylist({
            name: name,
            ownerName: subtitle,
            id: id,
            color: extractedColors?.colorDark?.hex,
            songs: songsSpotify,
            durationPlaylist: durationTotal,
            images: sources[0]?.url,
          });
        },
      };

      return spotifyTypes[infoSpotify.type]();
    }

    async function search_yt(msc: string) {
      const result = await YouTube.search(msc, { limit: 2 });
      return result[0];
    }
  }

  getComponentsMessage() {
    const { player } = this as any;
    const statusPlay = [
      AudioPlayerStatus.Playing,
      AudioPlayerStatus.Buffering,
    ].includes(player._state.status);
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
    } as any;
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
    } as any;

    return [components, components2];
  }
}

export = Queue;
