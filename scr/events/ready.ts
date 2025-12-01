import { Events } from "discord.js";
import play from "play-dl";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: any) => {
    console.log(`O bot ${client.user.username} está online`);

    client.user.setActivity(`De Darius Obviamente.`);

    play
      .getFreeClientID()
      .then((clientID) =>
        play.setToken({ soundcloud: { client_id: clientID } })
      )
      .catch((e) => console.log(e));
  },
};
