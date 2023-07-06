const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "coinflip",
    aliases: ['cf', 'coin', 'flip'],
    category: 'fun',
    description: 'Flips a coin',
    usage: '',
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`**${message.member.displayName} flipped ${result}**!`);
    message.channel.send(embed);
  }
};
