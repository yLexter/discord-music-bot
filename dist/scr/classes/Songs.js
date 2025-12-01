"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyPlaylist = exports.SpotifySong = exports.Playlist = exports.Song = void 0;
const { secondsToText, hashCode } = require("./Utils");
const { songType } = require("../enums/index");
class Song {
    constructor(options) {
        this.type = songType.track;
        this.id = "??";
        this.title = "??";
        this.url = "??";
        this.duration = 0;
        this.durationFormatted = "??";
        this.notSeekable = false;
        this.id = options.id || "??";
        this.title = options?.title || "??";
        this.url = options?.url || "??";
        this.duration = options?.duration || 0;
        this.durationFormatted = options.durationFormatted || "??";
        this.notSeekable = options.notSeekable || false;
    }
}
exports.Song = Song;
class Playlist {
    constructor(options) {
        this.type = songType.playlist;
        this.playlist = { name: "??", url: "??" };
        this.owner = { name: "??", url: "??" };
        this.songs = [];
        this.totalSongs = 0;
        this.durationFormatted = "??";
        this.durationInSeconds = 0;
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
exports.Playlist = Playlist;
class SpotifySong extends Song {
    constructor(options) {
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
exports.SpotifySong = SpotifySong;
class SpotifyPlaylist extends Playlist {
    constructor(options) {
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
exports.SpotifyPlaylist = SpotifyPlaylist;
