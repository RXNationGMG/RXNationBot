module.exports = {
    config: {
        name: 'leave',
        aliases: ['stop', 'dc'],
        category: 'music',
        description: 'Leaves the user\'s voice channel',
        usage: '',
        accessableby: 'everyone'
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        const serverQueue = ops.queue.get(message.guild.id);

        try {
            if (!channel) {
                return message.channel.send('You need to join a voice channel first!');
            }

            const permissions = channel.permissionsFor(bot.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK') || !permissions.has('VIEW_CHANNEL')) {
                return message.channel.send('<a:deny:892076004183506954> | I do not have the necessary permissions to leave your voice channel!');
            }

            if (!message.guild.me.voice.channel) {
                return message.channel.send('<a:deny:892076004183506954> | I am not currently in a voice channel!');
            }

            if (serverQueue && serverQueue.playing) {
                serverQueue.connection.dispatcher.end();
            }

            await channel.leave();
            message.channel.send('<a:check:892071687250673664> | Successfully left the voice channel!');
        } catch (error) {
            console.error(error);
            message.channel.send('<a:deny:892076004183506954> | An error occurred while trying to leave the voice channel. Please try again.');
        }
    }
};
