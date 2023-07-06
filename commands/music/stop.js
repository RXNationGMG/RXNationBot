module.exports = {
  config: {
    name: 'stop',
    noalias: [''],
    category: "music",
    description: "Stops the music playing",
    usage: ' ',
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send('<a:deny:892076004183506954> | I\'m sorry but you need to be in a voice channel to stop music!');
    }
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("**<a:deny:892076004183506954> | You Have To Be In The Same Channel With The Bot!**");
    }

    const serverQueue = ops.queue.get(message.guild.id);
    try {
      if (serverQueue) {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.guild.me.voice.channel.leave();
      } else {
        await channel.leave();
      }
      return message.channel.send('<a:check:892071687250673664> | **Successfully Disconnected**');
    } catch (error) {
      if (serverQueue) {
        serverQueue.connection.dispatcher.end();
      }
      await channel.leave();
      return message.channel.send("**<a:deny:892076004183506954> | Something Went Wrong!**");
    }
  }
};
