import translate from "@iamtraction/google-translate";
import jsonConfig from "../jsons/config.json";
import { SongsPagination } from "./MusicPagination";
import { Utils } from "./Utils";

export default class Base {
  public jsonConfig = jsonConfig as any;
  public Utils = Utils;
  public SongsPagination = SongsPagination;

  constructor() {}

  async translateText(text: string, langague: string): Promise<string | null> {
    return translate(text, { to: langague })
      .then((res: any) => res.text as string)
      .catch(() => null);
  }
}
