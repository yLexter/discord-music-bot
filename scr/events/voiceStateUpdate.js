const { Events } = require("discord.js")

const time = new Set()

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute: async (client, oldState, newState) => {

        const guild = newState.guild
        const channelBot = guild.members.me.voice.channel
        const timeToBack = 60

        if (!channelBot) return;
        if (oldState.id == client.user.id && oldState.channelId != newState.channelId) return verifyBotAlone();
        if (newState.channelId == channelBot.id) time.delete(guild.id);
        if ((oldState.channelId != channelBot.id) && (!oldState.channelId && newState.channelId)) return;

        return verifyBotAlone()

        function verifyBotAlone() {
            const allMembers = [...channelBot.members.values()].filter(x => x.user.id == client.user.id || !x.user.bot)

            if (allMembers.length != 1 && allMembers.find(x => x.id == client.user.id))
                return;

            time.add(guild.id)

            setTimeout(() => {
                if (!time.has(guild.id))
                    return;

                const queue = client.queues.get(guild.id)

                if (!queue)
                    return time.delete(guild.id)

                const channelId = queue.getConnection()?.joinConfig?.channelId
                const channel = guild.channels.cache.get(channelId)

                if (channel && [...channel.members.values()].length > 1)
                    return time.delete(guild.id)

                queue.stop()

            }, timeToBack * 1000)
        }
    }
}