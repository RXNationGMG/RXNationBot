const db = require('quick.db');

module.exports = {
  config: {
    name: "disablemodlogchannel",
    aliases: ['dmc', 'disablem'],
    category: 'moderation',
    description: 'Disables Server Modlog Channel',
    usage: '[channel name | channel mention | channel ID]',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
    }

    try {
      let modlogChannelId = db.fetch(`modlog_${message.guild.id}`);

      if (!modlogChannelId) {
        return message.channel.send('**<a:deny:892076004183506954> | There is no modlog channel set to disable!**');
      }

      let channel = message.guild.channels.cache.get(modlogChannelId);
      if (!channel) {
        db.delete(`modlog_${message.guild.id}`);
        return message.channel.send("**<a:deny:892076004183506954> | The modlog channel doesn't exist or has been deleted!**");
      }

      await channel.send("**<a:check:892071687250673664> | Modlog Channel Disabled!**");
      db.delete(`modlog_${message.guild.id}`);

      message.channel.send(`**<a:check:892071687250673664> | Modlog Channel has been successfully disabled in \`${channel.name}\`**`);
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | An error occurred while disabling the modlog channel!**");
    }
  }
};
