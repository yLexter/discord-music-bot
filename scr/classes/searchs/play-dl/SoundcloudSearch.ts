import { Playlist, Song } from "../../Songs";
import { Utils } from "../../Utils";

const play = require("play-dl");

export class SoundCloudSearch {
  public async search(query: string): Promise<Playlist | Song> {
    const data = await play.soundcloud(query);

    if (data.type === "track") {
      return await this.search_song({ ...data, query });
    } else {
      return await this.search_playlist({ ...data, query });
    }
  }

  private async search_song({ data }): Promise<any> {
    const { name, url, durationInMs, durationInSec, query } = data;

    return new Song({
      id: url,
      title: name,
      url: query,
      duration: durationInMs,
      durationFormatted: Utils.secondsToText(durationInSec),
      notSeekable: true,
    });
  }

  private async search_playlist({ data }) {
    const { name, durationInMs, user, query } = data;

    const songs = await data.all_tracks().map((song: any) => {
      const { id, name, durationInMs } = song;
      return new Song({
        id: `https://api.soundcloud.com/tracks/${id}`,
        title: name,
        url: query,
        duration: durationInMs,
        durationFormatted: Utils.secondsToText(durationInMs / 1000),
        notSeekable: true,
      });
    });

    return new Playlist({
      name: name,
      url: query,
      ownerName: user?.name,
      ownerUrl: user?.url,
      songs: songs,
      durationPlaylist: durationInMs,
    });
  }
}
