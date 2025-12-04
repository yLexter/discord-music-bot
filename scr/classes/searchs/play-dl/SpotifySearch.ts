import { SpotifyPlaylist, SpotifySong } from "../../Songs";
import { Utils } from "../../Utils";
import { YoutubeSearch } from "./YoutubeSearch";

const unfetch = require("isomorphic-unfetch");
const { getData } = require("spotify-url-info")(unfetch);

export class SpotifySearch {
  private youtubeSearch: YoutubeSearch;

  constructor() {
    this.youtubeSearch = new YoutubeSearch();
  }

  public async search(query: string) {
    const song = await getData(query);

    if (song.type === "track") {
      return this.search_song({ ...song, query });
    }

    return this.search_playlist({ ...song, query });
  }

  async search_song({ data }) {
    const queryStr = `${data.name} - ${
      data?.artists?.map((a) => a.name).join(" ") || ""
    }`;

    const msc = await this.youtubeSearch.search_song(queryStr);

    if (!msc) throw new Error("Música não Encontrada.");

    const { title, uri } = data;

    const song = new SpotifySong({
      id: msc.id,
      title: title,
      uri: uri,
      duration: msc.duration,
      durationFormatted: Utils.secondsToText(msc.duration / 1000),
    });

    return song;
  }

  async search_playlist({ data }) {
    const {
      name,
      subtitle,
      coverArt: { extractedColors, sources },
      id,
      trackList,
    } = data;
    const songsSpotify = [];

    for await (const song of trackList) {
      const { title, subtitle, uri } = song as any;
      const query = `${title} - ${subtitle}`;
      const ytSong = await this.youtubeSearch.search_song(query);

      if (!ytSong) continue;

      const data = new SpotifySong({
        id: ytSong.id,
        title: title,
        uri: uri,
        duration: ytSong.duration,
        durationFormatted: Utils.secondsToText(ytSong.duration / 1000),
      });

      songsSpotify.push(data);
    }

    const durationTotal = songsSpotify.reduce(
      (acc, song) => acc + song.duration,
      0
    );

    return new SpotifyPlaylist({
      name: name,
      ownerName: subtitle,
      id: id,
      color: extractedColors?.colorDark?.hex,
      songs: songsSpotify,
      durationPlaylist: durationTotal,
      images: sources[0]?.url,
    });
  }
}
