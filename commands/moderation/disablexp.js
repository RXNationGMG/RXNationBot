const db = require('quick.db');

module.exports = {
  config: {
    name: 'disablexp',
    aliases: ['dxp'],
    category: 'moderation',
    description: 'Disables Server XP Messages',
    usage: ' ',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
    }

    try {
      let xpMessagesEnabled = await db.fetch(`guildMessages_${message.guild.id}`);
      if (!xpMessagesEnabled) {
        return message.channel.send("**<a:warn:891035320030724196> | XP messages are already disabled in the server!**");
      }

      db.delete(`guildMessages_${message.guild.id}`);
      return message.channel.send("**<a:check:892071687250673664> | XP messages have been disabled successfully!**");
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Something went wrong!**");
    }
  }
};
