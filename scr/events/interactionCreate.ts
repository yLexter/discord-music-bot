import { Events, Interaction } from "discord.js";
import SlashCommand from "../classes/SlashCommand";
import Autocomplete from "../classes/AutoComplete";
import { CustomButtonInteraction } from "../classes/ButtonInteraction";
import CustomClient from "../classes/Client";

export default {
  name: Events.InteractionCreate,
  once: false,
  execute: async (client: CustomClient, interaction: Interaction) => {
    if (interaction.isButton())
      return new CustomButtonInteraction(client, interaction).main();
    if (interaction.isCommand())
      return new SlashCommand(client, interaction).executeCommand();
    if (interaction.isAutocomplete())
      return new Autocomplete(client, interaction).main();
  },
};
