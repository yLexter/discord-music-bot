"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_translate_1 = __importDefault(require("@iamtraction/google-translate"));
const config_json_1 = __importDefault(require("../jsons/config.json"));
const MusicPagination_1 = require("./MusicPagination");
const Utils_1 = require("./Utils");
class Base {
    constructor() {
        this.jsonConfig = config_json_1.default;
        this.Utils = Utils_1.Utils;
        this.SongsPagination = MusicPagination_1.SongsPagination;
    }
    async translateText(text, langague) {
        return (0, google_translate_1.default)(text, { to: langague })
            .then((res) => res.text)
            .catch(() => null);
    }
}
exports.default = Base;
