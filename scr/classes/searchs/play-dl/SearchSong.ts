import { Searcher } from "../interface";
import { SoundCloudSearch } from "./SoundcloudSearch";
import { SpotifySearch } from "./SpotifySearch";
import { YoutubeSearch } from "./YoutubeSearch";

export class SearchSongsPlaydl implements Searcher {
  private youtubeSearch: YoutubeSearch;
  private soundcloudSearch: SoundCloudSearch;
  private spotifySearch: SpotifySearch;

  constructor() {
    this.youtubeSearch = new YoutubeSearch();
    this.soundcloudSearch = new SoundCloudSearch();
    this.spotifySearch = new SpotifySearch();
  }

  async search(query: string) {
    const isSpotify = /((open|play)\.spotify\.com\/)/.test(query);
    const isSoundcloud = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/.test(
      query
    );

    if (isSpotify) {
      return this.spotifySearch.search(query);
    }
    if (isSoundcloud) {
      return this.soundcloudSearch.search(query);
    }

    return this.youtubeSearch.search(query);
  }
}
