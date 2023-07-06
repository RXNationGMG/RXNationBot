module.exports = {
    config: {
        name: 'loop',
        aliases: ["repeat"],
        category: "music",
        description: 'Repeats all songs in the queue',
        usage: "",
        accessableby: "everyone"
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;

        if (!channel) {
            return message.channel.send('<a:deny:892076004183506954> | I\'m sorry, but you need to be in a voice channel to loop the music!');
        }

        const serverQueue = ops.queue.get(message.guild.id);

        try {
            if (!serverQueue) {
                return message.channel.send('<a:warn:891035320030724196> | There is nothing playing.');
            }

            if (message.guild.me.voice.channel !== message.member.voice.channel) {
                return message.channel.send('<a:deny:892076004183506954> | You have to be in the same voice channel as the bot!');
            }

            serverQueue.loop = !serverQueue.loop;

            if (serverQueue.loop) {
                return message.channel.send('🔁 | The queue repeat has been enabled.');
            } else {
                return message.channel.send('🔁 | The queue repeat has been disabled.');
            }
        } catch (error) {
            console.error(error);
            message.channel.send('<a:deny:892076004183506954> | Something went wrong. Please try again.');
        }
    }
};
