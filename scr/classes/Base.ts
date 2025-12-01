// TypeScript version of Base.js
// Keeping CommonJS-friendly default export style

const database = require("./Database");
const DatabaseSongs = require("./DatabaseSongs");
const SquareApi = require("./HostApi");
const SongsPagination = require("./MusicPagination");
const Utils = require("./Utils");
const translate = require("@iamtraction/google-translate");
const jsonConfig = require("../jsons/config.json");

class Base {
  public DatabaseSongs = DatabaseSongs;
  public SquareApi = SquareApi;
  public Database = database;
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

export = Base;
