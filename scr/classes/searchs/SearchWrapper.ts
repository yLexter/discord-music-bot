import { Searcher } from "./interface";
import { SearchSongsPlaydl } from "./play-dl/SearchSong";

export class SearcherWrapper {
  constructor(private searcher: Searcher) {}

  public async search(query: string) {
    return this.searcher.search(query);
  }
}

export const searcherWrapper = new SearcherWrapper(new SearchSongsPlaydl());
