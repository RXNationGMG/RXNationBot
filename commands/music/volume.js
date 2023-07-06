module.exports = {
  config: {
    name: 'volume',
    aliases: ["vol"],
    category: "music",
    description: 'Shows and changes volume.',
    usage: ', vol [volume]',
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send('<a:deny:892076004183506954> | I\'m sorry but you need to be in a voice channel to change the volume!');
    }
    
    if (message.guild.me.voice.channel !== channel) {
      return message.channel.send("**<a:deny:892076004183506954> | You have to be in the same voice channel as the bot!**");
    }
    
    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send('889339329938350172 | There is nothing playing.');
    }
    
    if (!args[0]) {
      return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
    }
    
    try {
      const volume = parseInt(args[0]);
      if (isNaN(volume) || volume < 0 || volume > 10) {
        return message.channel.send('<a:deny:892076004183506954> | Please provide a valid volume between 0 and 10.');
      }
      
      serverQueue.volume = volume;
      serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 10);
      return message.channel.send(`<a:check:892071687250673664> I have set the volume to **${volume}**`);
    } catch (error) {
      console.error(error);
      return message.channel.send('**<a:deny:892076004183506954> | Something went wrong while changing the volume!**');
    }
  }
};
