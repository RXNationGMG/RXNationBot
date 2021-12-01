module.exports = {
    config: {
        name: 'join',
        aliases: ['joinvc'],
        category: 'music',
        description: 'Join The User\'s VC **NOTE! this cmd is kinda broken so dont use it! tnks!!**',
        usage: ' ',
        accessableby: 'everyone'
    },
    run: async (bot, message, args, ops) => {
        const { channel } = message.member.voice;
        const serverQueue = ops.queue.get(message.guild.id);
      try {
        if (!channel) return message.channel.send('**<a:deny:892076004183506954> You Need To Join A Voice Channel!**');
        if (!channel.permissionsFor(bot.user).has(['CONNECT', 'SPEAK', 'VIEW_CHANNEL'])) {
            return message.channel.send("**<a:deny:892076004183506954> Missing Voice Permissions!**");
        };
        if (message.guild.me.voice.channel) return message.channel.send('<a:deny:892076004183506954> **Bot is Already In The VC!**');
      
        if (serverQueue || serverQueue.playing) {
          return message.channel.send("**<a:deny:892076004183506954> Cannot Join Another VC While Playing!**")
        }
        await channel.join();
        return message.channel.send("**<a:check:892071687250673664> Joined The Voice Channel!**")
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**<a:deny:892076004183506954>Something Went Wrong, Please Try Again!**");
      }
    }
}
