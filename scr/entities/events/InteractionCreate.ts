import { ChatInputCommandInteraction } from "discord.js"
import { CustomClient } from "../bot/Client"
import { TypesCommand } from "../../shared"
import config from "../../config.json"

export class InteractionSlashCommand {

    static async execute(client: CustomClient, interaction: ChatInputCommandInteraction){

        const { guild, user } = interaction
        const { cooldowns, timeCooldown } = client
        const command = client.commands.get(interaction.commandName)

        if (!command)
          return interaction.reply("Comando não registrado.");

        const commandCooldown: string = `${guild?.id}-${user.id}-${command.data.name}`
        const cdCommand: number|undefined = cooldowns.get(commandCooldown)
        const defaultTimeCD: number = command.cooldown || timeCooldown

        if (cdCommand) {
            const time = defaultTimeCD - Math.floor(Date.now() / 1000 - cdCommand) || '??'
            return interaction.reply({ content: `⏰| **Este comando está em cooldown, aguarde \`${time}s.\`**` })
        }


       switch(command.type){
          case TypesCommand.owner: ownerCommand(); break;
          case TypesCommand.geral: executeCmd(); break;
       }


        function ownerCommand() {
            if (user.id != config.ownerId)
                return interaction.reply('❌| Apenas o dono do bot pode executar esse comando.');
            return executeCmd();
        }

        function executeCmd() {
            cooldowns.set(commandCooldown, Date.now() / 1000)

            setTimeout(() => {
                cooldowns.delete(commandCooldown)
            }, defaultTimeCD * 1000)

            command?.execute(client, interaction)
        }

    }



}