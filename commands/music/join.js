module.exports = {
    config: {
        name: 'join',
        aliases: ['joinvc'],
        category: 'music',
        description: 'Join the user\'s voice channel',
        usage: '',
        accessableby: 'everyone'
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;

        try {
            if (!channel) {
                return message.channel.send('<a:deny:892076004183506954> | You need to join a voice channel first!');
            }

            const permissions = channel.permissionsFor(bot.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK') || !permissions.has('VIEW_CHANNEL')) {
                return message.channel.send('<a:deny:892076004183506954> | I do not have the necessary permissions to join your voice channel!');
            }

            const connection = await channel.join();
            ops.queue.set(message.guild.id, { connection, songs: [], volume: 5, playing: false });

            message.channel.send('<a:check:892071687250673664> | Successfully joined the voice channel!');
        } catch (error) {
            console.error(error);
            message.channel.send('<a:deny:892076004183506954> | An error occurred while trying to join the voice channel. Please try again.');
        }
    }
};
