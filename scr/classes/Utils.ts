class Utils {
  static async textToSeconds(minute: string): Promise<number> {
    const formatar = async (numbers: string) => {
      const numbersArray = numbers.split(":").map((x) => {
        const number = Number(x);

        if (isNaN(number)) throw new Error("Use Horas:Minutos:Segundos.");

        return Math.floor(Math.abs(number));
      });

      while (numbersArray[0] == 0) numbersArray.shift();

      return numbersArray;
    };

    const time = await formatar(minute);
    const amount = time.length;

    const objects: Record<string, () => number> = {
      "0": () => 0,
      "1": () => {
        const [segundos] = time as any;

        if (segundos > 59) throw new Error("Número Invalido");

        return segundos;
      },
      "2": () => {
        const [minutos, segundos] = time as any;

        if (segundos > 59 || minutos > 59) throw new Error("Número Invalido");

        return minutos * 60 + segundos;
      },
      "3": () => {
        const [horas, minutos, segundos] = time as any;

        if (segundos > 59 || minutos > 59 || horas > 23)
          throw new Error("Número Invalido");

        return horas * 3600 + minutos * 60 + segundos;
      },
    };

    if (!objects[amount])
      throw new Error("Apenas é permitido horas, minutos e segundos");

    return objects[amount]();
  }

  static secondsToText(segundos: number): string {
    const dia = Math.floor(segundos / 86400);
    const restoDia = Math.floor(segundos % 86400);
    const horas = Math.floor(restoDia / 3600);
    const restoHoras = Math.floor(restoDia % 3600);
    const minutos = Math.floor(restoHoras / 60);
    const seconds = restoHoras % 60;
    const unitys = [dia, horas, minutos, seconds].map((unity) =>
      String(unity).padStart(2, "0")
    );

    while (unitys[0] == "00" && unitys.length != 2) unitys.shift();

    return unitys.join(":");
  }

  static formatDate(date: any): string {
    return String(moment(date).tz("America/Sao_Paulo").format("LLLL"));
  }

  static formattedSongTitle(string: string): string {
    let str = string.toLowerCase();

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
      "vídeoclipe",
    ];

    replaceStrings.forEach((x) => (str = (str as any).replaceAll(x, "")));

    return (str as any).capitalize();
  }

  static hashCode(string: string): number {
    let hash = 0;
    let number = 1000;

    for (let i = 0; i < string.length; i++) {
      let ch = string.charCodeAt(i);
      hash = (hash << 5) - hash + ch;
      hash = hash & hash;
    }

    hash = Math.abs(hash);

    if (hash < number) return hash;

    return Math.floor(hash / number);
  }
}

export = Utils;
