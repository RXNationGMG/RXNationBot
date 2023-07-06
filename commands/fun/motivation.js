const { MessageEmbed } = require('discord.js');
const jsonQuotes = require('../../JSON/motivational.json');

module.exports = {
  config: {
    name: 'motivation',
    aliases: ['motivate', 'motivational'],
    description: 'Get a random motivational quote',
    category: 'fun',
    usage: '[username | nickname | mention | ID](optional)',
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
        r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()
      ) ||
      message.member;

    const randomQuote = jsonQuotes.quotes[Math.floor(Math.random() * jsonQuotes.quotes.length)];

    const embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(randomQuote.author)
      .setDescription(randomQuote.text)
      .setColor('RANDOM')
      .setFooter(member.displayName, member.user.displayAvatarURL())
      .setTimestamp();

    if (args[0]) {
      embed.setTitle(`${randomQuote.author} -`);
      embed.setDescription(
        `**${randomQuote.text}**\n\nBy ${message.member.displayName} to ${member.displayName}`
      );
    }

    message.channel.send(embed);
  }
};
