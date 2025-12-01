"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class BackCommand extends Command_1.default {
    constructor() {
        super({
            name: "back",
            data: new builders_1.SlashCommandBuilder()
                .setName("back")
                .setDescription("Volta a tocar a música anterior"),
            type: "music",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        await queue.playBackMusic();
    }
}
exports.default = BackCommand;
