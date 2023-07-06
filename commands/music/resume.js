module.exports = {
  config: {
    name: 'resume',
    aliases: ["res"],
    category: "music",
    description: 'Resumes music',
    usage: " ",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send('<a:deny:892076004183506954> | I\'m sorry, but you need to be in a voice channel to resume music!');
    }
    const serverQueue = ops.queue.get(message.guild.id);
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("*<a:deny:892076004183506954> | *You have to be in the same channel with the bot!**");
    }
    try {
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send('▶ **Resumed**');
      }
      return message.channel.send('**<a:warn:891035320030724196> | There is nothing to resume**.');
    } catch {
      serverQueue.connection.dispatcher.end();
      return message.channel.send("**<a:deny:892076004183506954> | Something went wrong!**");
    }
  }
};
