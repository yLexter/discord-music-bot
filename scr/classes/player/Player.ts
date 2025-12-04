import { Song } from "../Songs";

export class PlayerSong {
  public status: "playing" | "paused" = "playing";

  async play(song: Song) {}

  async pause() {}

  async resume() {}

  async stop() {}

  async seek(seconds: number) {}
}
