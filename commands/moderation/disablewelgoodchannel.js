const db = require('quick.db');

module.exports = {
  config: {
    name: 'disablewelgoodchannel',
    aliases: ['dwgc', 'dwg', 'disablewcge'],
    category: 'moderation',
    description: 'Disables The Server Welcome & Goodbye Channel',
    usage: '[channel name | channel ID | channel mention]',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
    }

    try {
      let welcomeChannelID = db.fetch(`welcome_${message.guild.id}`);
      if (!welcomeChannelID) {
        return message.channel.send("**<a:deny:892076004183506954> | There is no welcome/goodbye channel set to disable!**");
      }

      let welcomeChannel = message.guild.channels.cache.get(welcomeChannelID);
      if (!welcomeChannel) {
        db.delete(`welcome_${message.guild.id}`);
        return message.channel.send("**<a:deny:892076004183506954> | The welcome/goodbye channel doesn't exist or has been deleted!**");
      }

      welcomeChannel.send("**<a:deny:892076004183506954> | This Welcome/Goodbye Channel Is Now Disabled!**");
      db.delete(`welcome_${message.guild.id}`);

      return message.channel.send(`**<a:check:892071687250673664> | Welcome/Goodbye Channel has been successfully disabled in \`${welcomeChannel.name}\`**`);
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | An error occurred while disabling the welcome channel!**");
    }
  }
};
