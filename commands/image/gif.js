const { MessageEmbed } = require('discord.js');
const { giphy_API } = require('../../config.js');
const giphy = require('giphy-api')(giphy_API);

module.exports = {
  config: {
    name: 'gif',
    category: 'image',
    aliases: ['search-gif', 'search-gifs'],
    description: 'Provide a query and I will return a gif!',
    usage: "[query]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription("**<a:deny:892076004183506954> | Please Enter A Search Query!**");
      return message.channel.send(embed);
    }
    try {
      const res = await giphy.search(args.join(' '));
      const id = res.data[0]?.id;
      if (!id) {
        return message.channel.send("**<a:deny:892076004183506954> | Not Found!**");
      }
      const url = `https://media.giphy.com/media/${id}/giphy.gif`;
      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter(message.guild.name, message.guild.iconURL())
        .setImage(url);
      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | An error occurred while searching for a gif.**");
    }
  }
};
