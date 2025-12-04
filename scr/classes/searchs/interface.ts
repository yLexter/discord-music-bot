import { Playlist, Song } from "../Songs";

export interface Searcher {
  search(query: string): Promise<Song | Playlist>;
}
