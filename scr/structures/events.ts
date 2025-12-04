import fs from "fs";
import path from "path";
import CustomClient from "../classes/Client";

export default (client: CustomClient) => {
  const files = fs.readdirSync(path.join(__dirname, "../events"));

  for (const eventFile of files) {
    const evento = require(`../events/${eventFile}`).default;

    if (evento.once) {
      client.once(evento.name, (...args) => evento.execute(client, ...args));
    } else {
      client.on(evento.name, (...args) => evento.execute(client, ...args));
    }
  }

  console.log("Eventos lidos com sucesso");
};
