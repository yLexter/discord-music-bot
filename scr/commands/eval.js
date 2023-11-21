const Command = require('../classes/Command')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

class CommandEval extends Command {
   constructor() {
      super({
         name: "eval",
         data: new SlashCommandBuilder()
            .setName('eval')
            .setDescription('Executa comandos como caller')
            .addStringOption(option =>
               option.setName('comando')
                  .setDescription('Digite o comando para executar')
                  .setRequired(true)),
         type: "owner",
      })
   }

   async execute(client, interaction) {

      const { cor } = client
      const comando = interaction.options.getString('comando');
      const queue = client.queues.get(interaction.guild.id)
      const int = interaction
      const { channel, guild, member } = interaction

      try {

         const resultado_ok = await eval(`(async () => { return ${comando}})()`)

         console.log(resultado_ok)

         const resultado = JSON.stringify(resultado_ok, null, '\t')?.substring(0, 3000)

         const helpMsg = new EmbedBuilder()
            .setColor(cor)
            .setDescription(`📥 **Entrada**\n\n` + `\`\`\`txt\n${comando}\n\`\`\`` + `\n\n📤 **Saída**\n\n` + `\`\`\`txt\n${resultado}\n\`\`\`\n`)

         return interaction.reply({
            embeds: [helpMsg],
            ephemeral: true
         })

      } catch (e) {
         const helpMsg = new EmbedBuilder()
            .setColor(cor)
            .setDescription(`📥 **Entrada**\n\n` + `\`\`\`txt\n${comando}\n\`\`\`` + `\n\n📤 **Saída**\n\n` + '```js\n' + `- ${e.stack}\n` + '```')

         return interaction.reply({
            embeds: [helpMsg],
            ephemeral: true
         })
      }
   }

}

module.exports = CommandEval
