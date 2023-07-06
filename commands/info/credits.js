const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "credits",
    aliases: [],
    category: 'info',
    description: 'Shows RXNationBot credits',
    usage: '',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    const embed = new MessageEmbed()
      .setTitle('RXNationBot Credits')
      .setColor("RANDOM")
      .setDescription(`**RXNationBot** is a bot created by <@725260858028195892>! Subscribe to RXNationGaming!!
https://youtube.com/c/RXNationGaming
Thanks :D`)
      .setFooter(message.guild.name, message.guild.iconURL());

    message.channel.send(embed);
  }
};
