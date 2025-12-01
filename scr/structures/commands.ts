import fs from "fs";
import path from "path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "../jsons/config.json";
import CustomClient from "../classes/Client";
import Command from "../classes/Command";

export default (client: CustomClient): void => {
  const {
    serverInfo: { clientId },
  } = config as any;

  const commandsDir = path.join(__dirname, "../commands");
  const files = fs
    .readdirSync(commandsDir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  const slashData: Command[] = [];

  for (const filename of files) {
    const filePath = path.join(commandsDir, filename);
    const Imported = require(filePath);

    const CommandClass = Imported.default ?? Imported;
    const commandInstance = new CommandClass();

    slashData.push(commandInstance.data.toJSON());

    client.commands.set(commandInstance.name, commandInstance);
  }

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN!);

  (async () => {
    try {
      await rest.put(Routes.applicationCommands(clientId), { body: slashData });
      console.log("Slash Commands registrados com sucesso");
    } catch (error) {
      console.error("Erro ao registrar slash commands", error);
    }
  })();
};
