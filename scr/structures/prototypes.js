module.exports = (client) => {

    String.prototype.isUrl = function () {
        const regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        return regex.test(this)
    }

    String.prototype.capitalize = function () {
        return this
            .toString()
            .split(" ")
            .filter(x => x)
            .map(char => char[0].toUpperCase() + char.slice(1).toLowerCase())
            .join(" ")
    }

    String.prototype.maximumChar = function (limit = 100, endThreePoints = false) {
        return this.length > limit ? endThreePoints ? this.slice(0, limit - 3) + '...' : this.slice(0, limit) : this.toString()
    }

    String.prototype.isUrlSpotify = function () {
        const regex = /((open|play)\.spotify\.com\/)/
        return regex.test(this)
    }

    String.prototype.isUrlYoutubePlaylist = function () {
        const regex = /^.*(youtu.be\/|list=)([^#\&\?]*).*/
        return regex.test(this)
    }

    String.prototype.isUrlSoundcloud = function () {
        const regex = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
        return regex.test(this)
    }

    Array.prototype.shuffle = function () {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]]
        }
    }

}



