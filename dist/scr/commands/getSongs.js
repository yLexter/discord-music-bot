"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
class GetSongsCommand extends Command_1.default {
    constructor() {
        super({
            name: "getsongs",
            data: new builders_1.SlashCommandBuilder()
                .setName("getsongs")
                .setDescription("Backup do arquivo de músicas"),
            type: "owner",
        });
    }
    async execute(client, interaction) {
        const { DatabaseSongs } = this;
        const json = await DatabaseSongs.getObjectJson();
        const stringJson = JSON.stringify(json, null, 2);
        const file = new discord_js_1.AttachmentBuilder(Buffer.from(stringJson), {
            name: "spotifySongs.json",
        });
        await interaction.reply({ files: [file] });
    }
}
exports.default = GetSongsCommand;
