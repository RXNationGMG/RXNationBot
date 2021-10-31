const Discord = require('discord.js');
const db = require('quick.db');
const rs = require('randomstring');
module.exports = {
    config: {
        name: 'setup-ticket',
        category: 'ticket',
        aliases: [''],
        description: 'Setup ticket system',
        accessableby: 'everyone',
        usage: ' '
    },
    run: async (bot, message, args) => {
    let ticketroom = message.mentions.channels.first();
      let embed = new Discord.MessageEmbed() .setDescription(`<a:deny:892076004183506954> Please Mention an vaild channel`)
      if(!ticketroom) return message.channel.send(embed);
      let sent = await ticketroom.send(new Discord.MessageEmbed()
      .setTitle("RXNationBot Ticket System")
      .setDescription("React With :tickets: To Open Ticket!")
      .setFooter(message.guild.name)
  );    
    sent.react('🎟️');
    db.delete(`tickets_${message.guild.id}`)
    db.set(`tickets_${message.guild.id}`, sent.id)
    message.channel.send("<a:check:892071687250673664> Great Job Human! Ticket-System are ready to be used!")
    }
}