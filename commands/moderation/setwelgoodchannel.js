const db = require("quick.db");

module.exports = {
  config: {
    name: "setwelgoodchannel",
    category: "moderation",
    aliases: ["enablewelgoodchannel", "swc", "ewc", "sw", "ew"],
    description: "Sets a channel where the bot can welcome users! (Beta)",
    usage: "[channel mention | channel ID | channel name]",
    accessableby: "Administrators",
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(
        "**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**"
      );
    }

    if (!args[0]) {
      const channelId = await db.fetch(`welcome_${message.guild.id}`);
      const channel = message.guild.channels.cache.get(channelId);

      if (channel) {
        return message.channel.send(
          `**⚠ | Welcome channel set in this server is \`${channel.name}\` channel!**`
        );
      } else {
        return message.channel.send(
          "**<a:deny:892076004183506954> | Please enter a channel name or ID to set!**"
        );
      }
    }

    const channel =
      message.mentions.channels.first() ||
      bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) ||
      message.guild.channels.cache.find(
        (c) =>
          c.name.toLowerCase() === args.join(" ").toLocaleLowerCase() &&
          c.type === "text"
      );

    if (!channel) {
      return message.channel.send(
        "**<a:deny:892076004183506954> | Please enter a valid text channel!**"
      );
    }

    try {
      const currentChannelId = await db.fetch(`welcome_${message.guild.id}`);

      if (currentChannelId === channel.id) {
        return message.channel.send(
          "**<a:deny:892076004183506954> | This channel is already set as the welcome/goodbye channel!**"
        );
      } else {
        bot.guilds.cache
          .get(message.guild.id)
          .channels.cache.get(channel.id)
          .send("**<a:check:892071687250673664> | Welcome/Goodbye Channel Is Successfully Set!**");
        db.set(`welcome_${message.guild.id}`, channel.id);

        return message.channel.send(
          `**<a:check:892071687250673664> | Welcome/Goodbye channel has been set successfully in \`${channel.name}\`!**`
        );
      }
    } catch (error) {
      console.error(error);
      return message.channel.send(
        "**<a:deny:892076004183506954> | Error - `Missing permissions or channel is not a text channel!`**"
      );
    }
  },
};
