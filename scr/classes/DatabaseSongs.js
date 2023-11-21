const fs = require("fs")
const { hashCode } = require("./Utils")

class DatabaseSongs {

    constructor() {
        this.path =  "./scr/jsons/spotifySongs.json"
    }

    async wirteFile(objectJson) {
        fs.writeFileSync(this.path, JSON.stringify(objectJson, null, 2), 'utf-8')
    }

    async getObjectJson() {
        const data = fs.readFileSync(this.path, 'utf-8')

        return JSON.parse(data)
    }

    async getSongs() {
        const data = await this.getObjectJson()
        return data.songs
    }

    async addSong(song) {
        let objectJson = await this.getObjectJson();

        if (Array.isArray(song)) {
            objectJson.songs = objectJson.songs.concat(song)

            return await this.wirteFile(objectJson)
        }

        objectJson.songs.push(song)

        await this.wirteFile(objectJson);
    }

    async searchSong(song) {
        const songs = await this.getSongs();
        const minimumToUseBB = 15
        const idSong = song.uri.split(":")[2]

        if (songs.length < minimumToUseBB)
            return songs.find(music => music.idSpotify == idSong)

        return await this.binarySearch(idSong)
    }

    async binarySearch(idSong) {
        const songs = await this.getSongs()
        const hash = hashCode(idSong)
        let first = 0
        let last = songs.length - 1
  
        while (last >= first) {
            const middleList = Math.ceil((first + last) / 2)
            const songHash = songs[middleList].hash

            if (songHash == hash)
                return songs[middleList];

            if (hash > songHash) {
                first = middleList + 1
            } else {
                last = middleList - 1
            }

        }

        return false
    }

    async sortArray() {
        const objectJson = await this.getObjectJson()

        objectJson.songs = objectJson.songs.sort((a, b) => a.hash - b.hash)

        return await this.wirteFile(objectJson)
    }

}

module.exports = new DatabaseSongs();