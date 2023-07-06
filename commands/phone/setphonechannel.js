const db = require('quick.db');

module.exports = {
  config: {
    name: 'setphonechannel',
    category: 'phone',
    aliases: ['setp', 'spc', 'setpc'],
    description: 'Sets a channel for phone calls',
    usage: '[channel mention | channel ID | channel name]',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.channel.send('**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**');
    }

    if (!args[0]) {
      let phoneChannelID = await db.fetch(`pc_${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(phoneChannelID);

      if (message.guild.channels.cache.has(phoneChannelID)) {
        return message.channel.send(`**<a:check:892071687250673664> | Phone call channel set in this server is \`${channelName.name}\`!**`);
      } else {
        return message.channel.send('**<a:deny:892076004183506954> | Please enter a channel name or ID to set!**');
      }
    }

    let channel = message.mentions.channels.first() ||
      bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) ||
      message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

    if (!channel) {
      return message.channel.send('**<a:deny:892076004183506954> | Please enter a valid channel name or ID!**');
    }

    try {
      let currentPhoneChannelID = await db.fetch(`pc_${message.guild.id}`);

      if (channel.id === currentPhoneChannelID) {
        return message.channel.send('**<a:deny:892076004183506954> | This channel is already set as the phone call channel!**');
      } else {
        bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send('**<a:check:892071687250673664> | Phone call channel successfully set!**');
        db.set(`pc_${message.guild.id}`, channel.id);
        db.push('pclist', { ChannelID: channel.id });

        return message.channel.send(`**<a:check:892071687250673664> | Phone call channel has been set successfully in \`${channel.name}\`!**`);
      }
    } catch {
      return message.channel.send('**<a:deny:892076004183506954> | Error - `Missing permissions or channel doesn\'t exist!`**');
    }
  }
};
