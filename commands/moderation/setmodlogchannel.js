const db = require("quick.db");

module.exports = {
  config: {
    name: "setmodlogchannel",
    category: "moderation",
    aliases: ["setm", "sm", "smc"],
    description: "Sets a channel where the bot can send moderation logs!",
    usage: "[channel mention | channel ID | channel name]",
    accessableby: "Administrators",
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
      }

      if (!args[0]) {
        const modlogChannelId = await db.fetch(`modlog_${message.guild.id}`);
        const channel = message.guild.channels.cache.get(modlogChannelId);

        if (channel) {
          return message.channel.send(`**<a:check:892071687250673664> | Modlog channel set in this server is \`${channel.name}\`!**`);
        } else {
          return message.channel.send("**<a:deny:892076004183506954> | Please enter a channel name or ID to set!**");
        }
      }

      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLowerCase());

      if (!channel || channel.type !== "text") {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a valid text channel!**");
      }

      const modlogChannelId = await db.fetch(`modlog_${message.guild.id}`);

      if (channel.id === modlogChannelId) {
        return message.channel.send("**<a:deny:892076004183506954> | This channel is already set as the modlog channel!**");
      } else {
        bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send("**<a:check:892071687250673664> | Modlog channel successfully set!**");
        db.set(`modlog_${message.guild.id}`, channel.id);

        return message.channel.send(`**<a:check:892071687250673664> | Modlog channel has been set successfully in \`${channel.name}\`!**`);
      }
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Error - `Missing permissions or channel is not a text channel!`**");
    }
  },
};
