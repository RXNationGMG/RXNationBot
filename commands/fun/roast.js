const { MessageEmbed } = require('discord.js');
const roasts = require('../../JSON/roast.json');

module.exports = {
  config: {
    name: 'roast',
    category: 'fun',
    noalias: [''],
    description: 'Roasts people',
    usage: '[username | nickname | mention | ID]',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        r =>
          r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        r =>
          r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()
      );

    if (!member) {
      const selfRoastEmbed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor('RANDOM')
        .setDescription('**<a:warn:891035320030724196> | Do You Really Want To Roast Yourself?**')
        .setFooter(message.member.displayName, message.author.displayAvatarURL())
        .setTimestamp();

      return message.channel.send(selfRoastEmbed);
    }

    const randomRoast = roasts.roast[Math.floor(Math.random() * roasts.roast.length)];

    const roastEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`${message.author.username}-`)
      .setColor('RANDOM')
      .setDescription(randomRoast)
      .setFooter(member.displayName, member.user.displayAvatarURL())
      .setTimestamp();

    message.channel.send(roastEmbed);
  }
};
