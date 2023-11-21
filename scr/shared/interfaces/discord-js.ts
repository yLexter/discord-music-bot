import { ColorResolvable , ClientEvents, Message, SlashCommandBuilder } from 'discord.js'
import { TypesCommand } from '../index'
import { CustomClient } from '../../entities'

export interface CommandOptions {
    type: TypesCommand,
    cooldown?: number,
    cor?: ColorResolvable
}

export interface ComponentsFunctionButton {
    msg: Message,
    challenged: string
}

export interface ClientEvent {
    name: keyof ClientEvents,
    once: boolean,
    run: (client: CustomClient, ...args: any) => Promise<void>
}

export interface CommandOptions {
    type: TypesCommand,
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
    cooldown?: number,
    cor?: ColorResolvable
}