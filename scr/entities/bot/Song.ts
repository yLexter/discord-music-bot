const { secondsToText, hashCode } = require("./Utils")
import { songType } from "../../shared"

export class Song {
    constructor(options) {
        this.type = songType.track,
            this.id = options.id || "??",
            this.title = options?.title || "??",
            this.url = options?.url || "??",
            this.duration = options?.duration || 0,
            this.durationFormatted = options.durationFormatted || '??'
        this.notSeekable = options.notSeekable || false
    }
}

export class Playlist {
    constructor(options) {
        this.type = songType.playlist,
            this.playlist = {
                name: options.name || "??",
                url: options.url || "??"
            },
            this.owner = {
                name: options.ownerName || "??",
                url: options.ownerUrl || '??'
            },
            this.songs = options.songs || [],
            this.totalSongs = options.songs?.length || 0,
            this.durationFormatted = secondsToText(options.durationPlaylist / 1000),
            this.durationInSeconds = options.durationPlaylist / 1000
        this.images = options?.images
    }
}

export class SpotifySong extends Song {
    constructor(options) {
        super(options)
        this.uri = options.uri
        this.idSpotify = this.getIdSpotify()
        this.url = this.getUrlSong()
        this.hash = this.getHashCode()
    }

    getIdSpotify() {
        return this.uri.split(":")[2]
    }

    getUrlSong() {
        const id = this.getIdSpotify()

        return `https://open.spotify.com/track/${id}`
    }

    getHashCode() {
        const id = this.getIdSpotify()

        return hashCode(id)
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
        }
    }
}

export class SpotifyPlaylist extends Playlist {
    constructor(options) {
        super(options)
        this.id = options.id
        this.color = options.color
        this.playlist.url = this.getUrlPlaylist()
        this.owner.url = this.getUrlPlaylist()
    }

    getUrlPlaylist() {
        return `https://open.spotify.com/playlist/${this.id}`
    }
}

