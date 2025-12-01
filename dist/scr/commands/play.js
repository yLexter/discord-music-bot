"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../classes/Command"));
const Queue_1 = __importDefault(require("../classes/Queue"));
const enums_1 = require("../enums");
class PlayCommand extends Command_1.default {
    constructor() {
        super({
            name: "play",
            data: new builders_1.SlashCommandBuilder()
                .setName("play")
                .setDescription("Toca uma música desejada")
                .addStringOption((opt) => opt
                .setName("search")
                .setDescription("Informe uma música para tocar")
                .setRequired(true)),
            type: "music",
            cooldown: 3,
        });
    }
    async execute(client, interaction) {
        const query = interaction.options.getString("search", true);
        try {
            await interaction.deferReply();
            //if (!interaction.member.voice.channel)
            //  throw new Error("Você precisa entrar em um canal de voz primeiro.");
            const queue = client.queues.get(interaction.guild.id) ||
                new Queue_1.default(client, interaction);
            const data = await Queue_1.default.songSearch(query, interaction);
            const handlers = {
                [enums_1.songType.track]: async () => queue.play(data, interaction),
                [enums_1.songType.playlist]: async () => {
                    const { playlist, owner, songs, totalSongs, durationFormatted, images, color, } = data;
                    const embedPlaylist = new discord_js_1.EmbedBuilder()
                        .setColor(color || client.cor)
                        .setDescription(`🅿️ **Playlist: [${playlist.name}](${playlist.url})\n🆔 Autor: [${owner.name}](${owner.url})\n📑 Total: ${totalSongs}\n🕑 Duração: ${durationFormatted}**`)
                        .setAuthor({
                        name: "| 🎶 Playlist adicionada",
                        iconURL: interaction.user.displayAvatarURL(),
                    });
                    if (images)
                        embedPlaylist.setThumbnail(images);
                    await interaction.editReply({ embeds: [embedPlaylist] });
                    queue.play(songs);
                },
            };
            await handlers[data.type]();
        }
        catch (e) {
            await interaction
                .editReply({ content: `Error => ${e.message}` })
                .catch(() => { });
            client.queues.delete(interaction.guild.id);
        }
    }
}
exports.default = PlayCommand;
