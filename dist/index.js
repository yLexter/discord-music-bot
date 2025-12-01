"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Client_1 = __importDefault(require("./scr/classes/Client"));
const commands_1 = __importDefault(require("./scr/structures/commands"));
const events_1 = __importDefault(require("./scr/structures/events"));
const client = new Client_1.default();
// Load structures
(0, commands_1.default)(client);
(0, events_1.default)(client);
client.startBot();
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});
process.on("uncaughtException", (e) => {
    console.error("Uncaught Exception:", e);
});
exports.default = client;
