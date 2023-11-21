const { ownerId } = require('../jsons/config.json')
const { AudioPlayerStatus } = require("@discordjs/voice")

class SlashCommand {
    constructor(client, interaction) {
        this.client = client
        this.interaction = interaction
        this.user = interaction.user
        this.member = interaction.member
        this.guild = interaction.guild
        this.channel = interaction.channel
    }

    async executeCommand() {

        const { user, guild, interaction, client, member } = this
        const { cooldown, timeCooldown } = client
        const command = client.commands.get(interaction.commandName)

        if (!guild.members.me.permissions.has('ADMINISTRATOR'))
            return client.embedError(interaction, "Preciso da permissão de administrator para executar os comandos")

        if (!command)
            return client.embedError(interaction, "Comando não registrado")

        const commandCooldown = `${guild.id}-${user.id}-${command.name}`
        const cdCommand = cooldown.get(commandCooldown)
        const defaultTimeCD = command.cooldown || timeCooldown

        if (cdCommand) {
            const time = defaultTimeCD - Math.floor(Date.now() / 1000 - cdCommand) || '??'
            return client.embedError(interaction, `Este comando está em cooldown, aguarde \`${time}s.\``)
        }

        const types = {
            owner,
            music,
            admin
        }

        types[command.type] ? types[command.type]() : executeCmd()

        function music() {
            const queue = client.queues.get(guild.id);
            const connection = queue?.getConnection()

            if (queue?.player._state.status == AudioPlayerStatus.Idle)
                return client.embedError(interaction, "Comandos não podem ser usado no momento de trocas de músicas")

            if (!queue || connection?.joinConfig.channelId == member?.voice?.channel?.id)
                return executeCmd()

            return client.embedError(interaction, "Você precisa estar no mesmo canal de voz que eu!")
        }

        function owner() {
            if (user.id != ownerId)
                return client.embedError(interaction, "Apenas o dono do bot pode executar este comando!")
            return executeCmd()
        }

        function admin() {
            if (!member.permissions.has('ADMINISTRATOR'))
                return client.embedError(interaction, "Este comando requer permissão de administrador.")
            return executeCmd()
        }

        function executeCmd() {
            cooldown.set(commandCooldown, Date.now() / 1000)

            setTimeout(() => {
                cooldown.delete(commandCooldown)
            }, defaultTimeCD * 1000)

            return client.commands.get(command.name)
                .execute(client, interaction)
                .catch(e => client.embedError(interaction, e))
        }


    }
}

module.exports = SlashCommand