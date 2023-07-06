const Discord = require('discord.js');
const db = require('quick.db');
const rs = require('randomstring');

module.exports = {
  config: {
    name: 'setup-ticket',
    category: 'ticket',
    aliases: [''],
    description: 'Setups the ticket system',
    accessableby: 'everyone',
    usage: ' '
  },
  run: async (bot, message, args) => {
    const ticketroom = message.mentions.channels.first();
    if (!ticketroom) {
      return message.channel.send('<a:deny:892076004183506954> | Please mention a valid channel');
    }
    
    try {
      const sent = await ticketroom.send(new Discord.MessageEmbed()
        .setTitle('RXNationBot Ticket System')
        .setDescription('React with 🎟️ to open a ticket!')
        .setFooter(message.guild.name)
      );
      
      sent.react('🎟️');
      db.delete(`tickets_${message.guild.id}`);
      db.set(`tickets_${message.guild.id}`, sent.id);
      return message.channel.send('<a:check:892071687250673664> | Great job! The ticket system is ready to be used!');
    } catch (error) {
      console.error(error);
      return message.channel.send('<a:deny:892076004183506954> | An error occurred while setting up the ticket system. Please try again later.');
    }
  }
};
