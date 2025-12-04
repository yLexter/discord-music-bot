import dotenv from "dotenv";
dotenv.config();

import loadCommands from "./scr/structures/commands";
import loadEvents from "./scr/structures/events";
import CustomClient from "./scr/classes/Client";

const client = new CustomClient();

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
