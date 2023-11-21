import { ChatInputCommandInteraction } from "discord.js";
import { CustomClient } from "./Client";
import { CommandOptions } from "../../shared";

abstract class Command {
    public data
    public type
    public cooldown
    public cor
 
    constructor(options: CommandOptions) {
       this.data = options.data,
       this.type = options.type,
       this.cooldown = options.cooldown || 2,
       this.cor = options.cor || 'RANDOM'
    }
 
    public abstract execute(client: CustomClient, interaction: ChatInputCommandInteraction): Promise<any>
 }

export { Command }