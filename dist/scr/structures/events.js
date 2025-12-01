"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = (client) => {
    const files = fs_1.default.readdirSync(path_1.default.join(__dirname, "../events"));
    for (const eventFile of files) {
        const evento = require(`../events/${eventFile}`);
        if (evento.once) {
            client.once(evento.name, (...args) => evento.execute(client, ...args));
        }
        else {
            client.on(evento.name, (...args) => evento.execute(client, ...args));
        }
    }
    console.log("Eventos lidos com sucesso");
};
