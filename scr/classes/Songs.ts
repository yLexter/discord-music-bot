const { secondsToText, hashCode } = require("./Utils");
const { songType } = require("../enums/index");

export interface ISongOptions {
  id: string;
  title?: string;
  url?: string;
  duration?: number;
  durationFormatted?: string;
  notSeekable?: boolean;
}

export interface IPlaylistOptions {
  name: string;
  url?: string;
  ownerName?: string;
  ownerUrl?: string;
  songs: Song[];
  durationPlaylist: number;
  images?: string;
}

interface ISpotifySongOptions extends ISongOptions {
  uri: string;
}

export interface ISpotifyPlaylistOptions extends IPlaylistOptions {
  id: string;
  color?: string;
}

export class Song {
  type = songType.track;
  id: string = "??";
  title: string = "??";
  url: string = "??";
  duration: number = 0;
  durationFormatted: string = "??";
  notSeekable: boolean = false;

  constructor(options: ISongOptions) {
    this.id = options.id || "??";
    this.title = options?.title || "??";
    this.url = options?.url || "??";
    this.duration = options?.duration || 0;
    this.durationFormatted = options.durationFormatted || "??";
    this.notSeekable = options.notSeekable || false;
  }
}

export class Playlist {
  type = songType.playlist;
  playlist: { name: string; url: string } = { name: "??", url: "??" };
  owner: { name: string; url: string } = { name: "??", url: "??" };
  songs: Song[] = [];
  totalSongs = 0;
  durationFormatted = "??";
  durationInSeconds = 0;
  images?: string;

  constructor(options: IPlaylistOptions) {
    this.playlist = {
      name: options.name || "??",
      url: options.url || "??",
    };
    this.owner = {
      name: options.ownerName || "??",
      url: options.ownerUrl || "??",
    };
    this.songs = options.songs || [];
    this.totalSongs = options.songs?.length || 0;
    this.durationFormatted = secondsToText(options.durationPlaylist / 1000);
    this.durationInSeconds = options.durationPlaylist / 1000;
    this.images = options?.images;
  }
}

export class SpotifySong extends Song {
  uri: string;
  idSpotify: string;
  hash: number;

  constructor(options: ISpotifySongOptions) {
    super(options);
    this.uri = options.uri;
    this.idSpotify = this.getIdSpotify();
    this.url = this.getUrlSong();
    this.hash = this.getHashCode();
  }

  getIdSpotify() {
    return this.uri.split(":")[2];
  }

  getUrlSong() {
    const id = this.getIdSpotify();
    return `https://open.spotify.com/track/${id}`;
  }

  getHashCode() {
    const id = this.getIdSpotify();
    return hashCode(id);
  }

  toJSON() {
    return {
      type: this.type,
      id: this.id,
      title: this.title,
      url: this.url,
      duration: this.duration,
      durationFormatted: this.durationFormatted,
      hash: this.hash,
    };
  }
}

export class SpotifyPlaylist extends Playlist {
  id: string;
  color?: string;

  constructor(options: ISpotifyPlaylistOptions) {
    super(options);
    this.id = options.id;
    this.color = options.color;
    this.playlist.url = this.getUrlPlaylist();
    this.owner.url = this.getUrlPlaylist();
  }

  getUrlPlaylist() {
    return `https://open.spotify.com/playlist/${this.id}`;
  }
}
