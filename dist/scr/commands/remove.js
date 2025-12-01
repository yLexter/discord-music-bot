"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class RemoveCommand extends Command_1.default {
    constructor() {
        super({
            name: "remove",
            data: new builders_1.SlashCommandBuilder()
                .setName("remove")
                .setDescription("Remove uma música da queue pela posição")
                .addIntegerOption((opt) => opt
                .setName("songpos")
                .setDescription("Selecione a posição da música")
                .setRequired(true)
                .setMinValue(1)),
            help: "Remove música específica da queue",
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        const pos = interaction.options.getInteger("songpos", true);
        if (pos === 0)
            throw new Error("Não é possível remover a música atual com este comando");
        const music = queue.songs[pos];
        if (!music)
            throw new Error("Posição inválida para remoção");
        queue.remove(pos);
        await interaction.reply({ content: `Música removida: ${music.title}` });
    }
}
exports.default = RemoveCommand;
