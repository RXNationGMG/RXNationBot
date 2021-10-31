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
        if (!args[0]) return message.channel.send("**<a:deny:892076004183506954> Please Enter A Song Number!**")

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('<a:deny:892076004183506954> I\'m sorry but you need to be in a voice channel to remove a particular song number!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**<a:deny:892076004183506954> You Have To Be In The Same Channel With The Bot!**");
        };
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('<a:deny:892076004183506954> **Nothing playing in this server**');
      try {
        if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
            return message.channel.send('**<a:deny:892076004183506954> Please Enter A Valid Song Number!**');
        }
        serverQueue.songs.splice(args[0] - 1, 1);
        return message.channel.send(`<a:check:892071687250673664> Removed song number ${args[0]} from queue`);
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**<a:deny:892076004183506954> Something Went Wrong!**")
      }
    }
};