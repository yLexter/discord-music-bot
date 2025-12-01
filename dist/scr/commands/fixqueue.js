"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
class FixQueueCommand extends Command_1.default {
    constructor() {
        super({
            name: "fixqueue",
            data: new builders_1.SlashCommandBuilder()
                .setName("fixqueue")
                .setDescription("Conserta a queue atual caso esteja bugada"),
            type: "admin",
        });
    }
    async execute(client, interaction) {
        const queue = client.queues.get(interaction.guild.id);
        if (!queue)
            return super.notQueue(interaction);
        client.queues.delete(interaction.guild.id);
        queue.stop();
    }
}
exports.default = FixQueueCommand;
