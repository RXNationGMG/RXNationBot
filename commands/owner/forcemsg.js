const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'forcemessage',
    aliases: ['forcemsg'],
    category: 'owner',
    description: 'Sends a message as the bot owner',
    usage: '',
    accessableby: 'Owner'
  },
  run: async (bot, message, args) => {
    const ownerIds = ['725260858028195892'];
    
    if (!ownerIds.includes(message.author.id)) {
      return;
    }

    message.delete();
    const channel = message.mentions.channels.first();

    if (!channel) {
      return message.channel.send('<a:deny:892076004183506954> | Please mention a channel!');
    }

    const content = args.slice(1).join(' ');

    if (!content) {
      return message.channel.send('<a:deny:892076004183506954> | You must specify the message you want to send!');
    }

    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Message From The Bot Owner!')
      .setDescription(content)
      .setTimestamp()
      .setFooter('© RXNationBot | 2020 - 2023');

    channel.send(embed);
  }
};
