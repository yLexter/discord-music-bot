"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const SlashCommand_1 = __importDefault(require("../classes/SlashCommand"));
const AutoComplete_1 = __importDefault(require("../classes/AutoComplete"));
const ButtonInteraction_1 = require("../classes/ButtonInteraction");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    once: false,
    execute: async (client, interaction) => {
        if (interaction.isButton())
            return new ButtonInteraction_1.CustomButtonInteraction(client, interaction).main();
        if (interaction.isCommand())
            return new SlashCommand_1.default(client, interaction).executeCommand();
        if (interaction.isAutocomplete())
            return new AutoComplete_1.default(client, interaction).main();
    },
};
