module.exports = {
  config: {
    name: "skipto",
    noalias: "",
    category: "music",
    description: "Skips To A Particular Song In Queue",
    usage: "[song number] (put acc. to distance between songs)",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    if (!args[0]) {
      return message.channel.send("** <a:deny:892076004183506954> | Please Enter A Song Number!**");
    }

    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send('**<a:deny:892076004183506954> | I\'m Sorry But You Need To Be In A Voice Channel To Skip To A Particular Song!**');
    }

    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send('<a:warn:891035320030724196> | **Nothing playing in this server**');
    }

    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("<a:deny:892076004183506954> | **You Have To Be In The Same Channel With The Bot!**");
    }

    const songNumber = parseInt(args[0]);
    if (isNaN(songNumber) || songNumber < 1 || songNumber > serverQueue.songs.length) {
      return message.channel.send('**<a:deny:892076004183506954> | Please Enter A Valid Song Number!**');
    }

    try {
      serverQueue.songs.splice(0, songNumber - 2);
      serverQueue.connection.dispatcher.end();
      return;
    } catch (error) {
      serverQueue.connection.dispatcher.end();
      await channel.leave();
      return message.channel.send("**<a:deny:892076004183506954> | Something Went Wrong!**");
    }
  }
};
