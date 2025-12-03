import { Song } from "../Songs";

export class PlayerSong {
  async play(song: Song) {}

  async pause() {}

  async resume() {}

  async stop() {}

  async seek(seconds: number) {}
}
