const db = require('quick.db');
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: 'setverification',
    aliases: ['sv', 'setv', 'setverify'],
    category: 'moderation',
    description: 'Sets Verification Channel And Role',
    usage: '[channel name | channel ID | channel mention] <role name | role ID | role mention]',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    try {
      let prefix = await db.fetch(`prefix_${message.guild.id}`);
      prefix = prefix ? prefix : PREFIX;

      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]!**");
      }

      if (!args[0]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a channel name where the user should be asked to verify!**");
      }

      if (!args[1]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a role which will be added after the user is verified!**");
      }

      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args[0].toLowerCase());
      if (!channel || channel.type !== 'text') {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a valid channel!**");
      }

      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[1].toLowerCase());
      if (!role) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a valid role!**");
      }

      const verificationChannelId = await db.fetch(`verificationchannel_${message.guild.id}`);
      const verificationRoleId = await db.fetch(`verificationrole_${message.guild.id}`);

      if (channel.id === verificationChannelId && role.id === verificationRoleId) {
        return message.channel.send('**<a:deny:892076004183506954> | This channel and role are already set for verification!**');
      }

      message.guild.channels.cache.forEach(channel => {
        if (channel.type === 'category' && channel.id === channel.id) return;

        const rolePermission = channel.permissionOverwrites.get(role.id);
        if (!rolePermission || rolePermission.deny.has("VIEW_CHANNEL") || rolePermission.deny.has("SEND_MESSAGES")) return;

        channel.createOverwrite(message.guild.id, {
          VIEW_CHANNEL: false
        });

        channel.updateOverwrite(role, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        });
      });

      channel.updateOverwrite(role, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false
      });

      bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(`**Welcome To ${message.guild.name}!\nTo Get Verified Type - \`${prefix}verify\`**`);

      db.set(`verificationchannel_${message.guild.id}`, channel.id);
      db.set(`verificationrole_${message.guild.id}`, role.id);

      return message.channel.send(`**<a:check:892071687250673664> | Verification channel and role have been set successfully in \`${channel.name}\`!**`);
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Error - `Missing permissions or channel is not a text channel!`**");
    }
  }
};
