const db = require('quick.db');

module.exports = {
  config: {
    name: 'setxp',
    aliases: ['enablexp'],
    category: 'moderation',
    description: 'Enables server XP messages',
    usage: '',
    accessableby: 'Administrators',
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(
        "**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**"
      );
    }

    try {
      const hasXPEnabled = await db.fetch(`guildMessages_${message.guild.id}`);

      if (hasXPEnabled) {
        return message.channel.send(
          "**<a:warn:891035320030724196> | XP messages are already enabled in the server!**"
        );
      } else {
        db.set(`guildMessages_${message.guild.id}`, 1);

        return message.channel.send(
          "**<a:check:892071687250673664> | XP messages are enabled successfully!**"
        );
      }
    } catch (error) {
      console.error(error);
      return message.channel.send(
        "**<a:deny:892076004183506954> | Something went wrong!**"
      );
    }
  },
};
