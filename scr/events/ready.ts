import { Events } from "discord.js";
import play from "play-dl";
import Database from "../classes/Database";
import mongoose from "mongoose";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: any) => {
    mongoose.set("strictQuery", true);

    console.log(`O bot ${client.user.username} está online`);

    client.user.setActivity(`De Darius Obviamente.`);

    Database.connect();

    play
      .getFreeClientID()
      .then((clientID) =>
        play.setToken({ soundcloud: { client_id: clientID } })
      )
      .catch((e) => console.log(e));
  },
};
