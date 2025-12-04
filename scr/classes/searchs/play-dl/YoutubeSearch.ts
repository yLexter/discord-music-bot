import { Playlist, Song } from "../../Songs";
import YouTubeLib from "youtube-sr";

const YouTube = (YouTubeLib as any).default || (YouTubeLib as any);
const play = require("play-dl");

export class YoutubeSearch {
  private async search_yt(query: string) {
    const result = await YouTube.search(query, { limit: 2 });
    return result[0];
  }

  public async search(query: string) {
    const isYoutubePlaylist =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/.test(
        query
      );

    if (isYoutubePlaylist) {
      return this.search_playlist(query);
    } else {
      return this.search_song(query);
    }
  }

  async search_song(query: string) {
    let song: any;

    const isUrlYoutubeVideo =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(query);

    if (isUrlYoutubeVideo) {
      song = await YouTube.getVideo(query);
    } else {
      const busca = await this.search_yt(query);

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

  async search_playlist(query: string) {
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

    const { title, channel, url } = playlist;
    const durationPlaylist = songs.reduce(
      (acc: number, song: Song) => acc + song.duration,
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
}
