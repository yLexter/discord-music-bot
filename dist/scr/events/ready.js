"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const play_dl_1 = __importDefault(require("play-dl"));
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log(`O bot ${client.user.username} está online`);
        client.user.setActivity(`De Darius Obviamente.`);
        play_dl_1.default
            .getFreeClientID()
            .then((clientID) => play_dl_1.default.setToken({ soundcloud: { client_id: clientID } }))
            .catch((e) => console.log(e));
    },
};
