module.exports = {
  config: {
    name: "remove",
    aliases: ["rs"],
    category: "music",
    description: "Remove Song In A Queue!",
    usage: "[song number]",
    acessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a song number!**");
    }

    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send('<a:deny:892076004183506954> | I\'m sorry, but you need to be in a voice channel to remove a particular song number!');
    }
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("**<a:deny:892076004183506954> | You have to be in the same channel with the bot!**");
    }
    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send('<a:warn:891035320030724196> | **Nothing is playing in this server**');
    }
    try {
      if (args[0] < 1 || args[0] > serverQueue.songs.length || isNaN(args[0])) {
        return message.channel.send('**<a:deny:892076004183506954> | Please enter a valid song number!**');
      }
      serverQueue.songs.splice(args[0] - 1, 1);
      return message.channel.send(`<a:check:892071687250673664> | Removed song number ${args[0]} from the queue.`);
    } catch {
      serverQueue.connection.dispatcher.end();
      return message.channel.send("**<a:deny:892076004183506954> | Something went wrong!**");
    }
  }
};
