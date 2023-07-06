const { stripIndents } = require('common-tags');
const db = require('quick.db');

module.exports = {
  config: {
    name: 'phonebook',
    aliases: ['pb', 'pbook', 'phoneregister'],
    category: 'phone',
    usage: '[channel name | server name] (optional)',
    description: 'Searches for phone-enabled servers!',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    let phoneChannels = db.fetch('pclist');
    
    if (!phoneChannels) {
      return message.channel.send('**<a:deny:892076004183506954> | No channels are currently allowing phone calls!**');
    }
    
    let phoneList = phoneChannels
      .sort((a, b) => b.ChannelID - a.ChannelID)
      .map(r => r.ChannelID);
    
    let query = args.join(' ');
    
    if (args[0]) {
      const channels = bot.channels.cache.filter(channel => {
        return channel.guild
          && phoneList.includes(channel.id)
          && (channel.guild.name.toLowerCase() === query.toLowerCase() || channel.name.toLowerCase() === query.toLowerCase() || channel.id === query)
          && !message.guild.channels.cache.has(channel.id);
      });
      
      if (!channels.size) {
        return message.channel.send('**<a:deny:892076004183506954> | Could not find any results!**');
      }
      
      return message.channel.send(stripIndents`
        **Results -** \`${channels.size}\`
        ${channels.map(c => `\`${c.id}\` - **#${c.name} in ${c.guild.name}**`).slice(0, 10).join('\n')}
      `);
    } else {
      const channels = bot.channels.cache.filter(channel => channel.guild
        && phoneList.includes(channel.id)
        && !message.guild.channels.cache.has(channel.id));
      
      return message.channel.send(stripIndents`
        **Results -** \`${channels.size}\`
        ${channels.map(c => `\`${c.id}\` - **#${c.name} in ${c.guild.name}**`).slice(0, 10).join('\n')}
      `);
    }
  }
};
