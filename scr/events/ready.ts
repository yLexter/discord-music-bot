import { Events } from "discord.js";
import play from "play-dl";
import CustomClient from "../classes/Client";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: CustomClient) => {
    console.log(`O bot ${client.user.username} está online`);

    play
      .getFreeClientID()
      .then((clientID) =>
        play.setToken({ soundcloud: { client_id: clientID } })
      )
      .catch((e) => console.log(e));
  },
};
