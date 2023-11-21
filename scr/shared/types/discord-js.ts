import { 
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction, 
    CommandInteraction, 
    ContextMenuCommandInteraction,
    Interaction,
    MessageComponentInteraction, 
    MessageContextMenuCommandInteraction, 
    ModalSubmitInteraction,
    SelectMenuInteraction, 
    UserContextMenuCommandInteraction 
} from 'discord.js';

export type TAnyInteraction =  Interaction & (
    | AutocompleteInteraction
    | ButtonInteraction
    | ChatInputCommandInteraction
    | CommandInteraction
    | ContextMenuCommandInteraction
    | MessageComponentInteraction
    | MessageContextMenuCommandInteraction
    | ModalSubmitInteraction
    | SelectMenuInteraction
    | UserContextMenuCommandInteraction
  )