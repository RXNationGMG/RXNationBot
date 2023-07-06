const db = require('quick.db');

module.exports = {
  config: {
    name: "setprefix",
    aliases: ['sp', 'prefix'],
    category: "moderation",
    description: "Sets custom prefix",
    usage: "[prefix]",
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send("**<a:deny:892076004183506954> | You do not have sufficient permissions! - [ADMINISTRATOR]**");
      }

      if (!args[0]) {
        const currentPrefix = await db.fetch(`prefix_${message.guild.id}`);
        if (currentPrefix) {
          return message.channel.send(`**The prefix for this server is \`${currentPrefix}\`**`);
        } else {
          return message.channel.send("**<a:deny:892076004183506954> | Please enter a prefix to set!**");
        }
      }

      const newPrefix = args[0].toLowerCase();
      const currentPrefix = await db.fetch(`prefix_${message.guild.id}`);

      if (newPrefix === currentPrefix) {
        return message.channel.send('**<a:deny:892076004183506954> | This is already the server prefix!**');
      } else {
        db.set(`prefix_${message.guild.id}`, newPrefix);
        return message.channel.send(`**<a:check:892071687250673664> | Successfully set server prefix to \`${newPrefix}\`**`);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
