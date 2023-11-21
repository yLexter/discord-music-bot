import { CustomClient } from "../entities"
import { Events } from 'discord.js'
import { TAnyInteraction } from "../shared";
import { InteractionSlashCommand } from "../entities/events/InteractionCreate";

export default {
    name: Events.InteractionCreate,
    once: false,
    execute: async (client: CustomClient, interaction: TAnyInteraction) => {

        if (interaction.isChatInputCommand())
            return InteractionSlashCommand.execute(client, interaction);

    }
}





