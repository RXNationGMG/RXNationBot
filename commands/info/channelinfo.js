const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "channelinfo",
    aliases: ['ci', 'channeli', 'cinfo'],
    category: "info",
    description: "Shows Channel Info",
    usage: "[ channel mention | channel name | ID] (optional)",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;
    
    if (!channel) return message.channel.send("**<a:deny:892076004183506954> | Channel Not Found!**");

    const channelembed = new MessageEmbed()
      .setTitle(`Channel Information for ${channel.name}`)
      .setThumbnail(message.guild.iconURL())
      .addField("**NSFW**", channel.nsfw, true)
      .addField("**Channel ID**", channel.id, true)
      .addField("**Channel Type**", channel.type)
      .addField("**Channel Description**", channel.topic || "No Description")
      .addField("**Channel Created At**", channel.createdAt)
      .setColor("RANDOM");

    message.channel.send(channelembed);
  }
};
