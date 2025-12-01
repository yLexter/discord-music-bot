"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const config_json_1 = __importDefault(require("../jsons/config.json"));
exports.default = (client) => {
    const { serverInfo: { clientId }, } = config_json_1.default;
    const commandsDir = path_1.default.join(__dirname, "../commands");
    const files = fs_1.default
        .readdirSync(commandsDir)
        .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));
    const slashData = [];
    for (const filename of files) {
        const filePath = path_1.default.join(commandsDir, filename);
        const Imported = require(filePath);
        const CommandClass = Imported.default ?? Imported;
        const commandInstance = new CommandClass();
        slashData.push(commandInstance.data.toJSON());
        client.commands.set(commandInstance.name, commandInstance);
    }
    const rest = new rest_1.REST({ version: "9" }).setToken(process.env.TOKEN);
    (async () => {
        try {
            await rest.put(v9_1.Routes.applicationCommands(clientId), { body: slashData });
            console.log("Slash Commands registrados com sucesso");
        }
        catch (error) {
            console.error("Erro ao registrar slash commands", error);
        }
    })();
};
