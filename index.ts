import dotenv from "dotenv";
dotenv.config();

import Client from "./scr/classes/Client";
import loadCommands from "./scr/structures/commands";
import loadEvents from "./scr/structures/events";

const client = new Client();

// Load structures
loadCommands(client);
loadEvents(client);

client.startBot();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (e) => {
  console.error("Uncaught Exception:", e);
});

export default client;
