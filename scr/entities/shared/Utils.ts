export class Utils {

    static async textToSeconds(minute: string) {
       return ""
    }

    static secondsToText(segundos: number) {
        const dia = Math.floor(segundos / 86400)
        const restoDia = Math.floor(segundos % 86400)
        const horas = Math.floor(restoDia / 3600)
        const restoHoras = Math.floor(restoDia % 3600)
        const minutos = Math.floor(restoHoras / 60)
        const seconds = restoHoras % 60
        const unitys = [dia, horas, minutos, seconds].map(unity => String(unity).padStart(2, "0"))

        while (unitys[0] == '00' && unitys.length != 2)
            unitys.shift();

        return unitys.join(':')
    }

    static formatDate(date: Date) {
        return null
    }

    static formattedSongTitle(string: string) {
        let str = string.toLowerCase()

        const replaceStrings = [
            "oficial",
            "[",
            "]",
            "(",
            ")",
            "music",
            "official",
            "video",
            "soundtrack",
            "vídeo",
            "clipe",
            "lyric",
            "lyrics",
            "audio",
            "áudio",
            "4k",
            "dvd",
            "videoclipe",
            "vídeoclipe"
        ]

        replaceStrings.forEach(x => str = str.replace(x, ""))

        return str
    }

    static hashCode(string: string) {
        let hash = 0;
        let number = 1000

        for (let i = 0; i < string.length; i++) {
            let ch = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash = hash & hash;
        }

        hash = Math.abs(hash)

        if (hash < number)
            return hash;

        return Math.floor(hash / number);
    }

}
