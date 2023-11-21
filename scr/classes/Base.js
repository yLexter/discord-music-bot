const database = require("./Database")
const DatabaseSongs = require("./DatabaseSongs")
const SquareApi = require("./HostApi")
const SongsPagination = require("./MusicPagination")
const Utils = require("./Utils")
const translate = require("@iamtraction/google-translate");
const jsonConfig = require("../jsons/config.json")

class Base {
    constructor() {
        this.DatabaseSongs = DatabaseSongs
        this.SquareApi = SquareApi
        this.Database = database
        this.jsonConfig = jsonConfig
        this.Utils = Utils
        this.SongsPagination = SongsPagination
    }

    async translateText(text, langague) {
        return translate(text, { to: langague })
            .then(res => res.text)
            .catch(() => null)
    }
}

module.exports = Base