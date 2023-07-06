module.exports = {
  config: {
    name: "leaveserver",
    aliases: [""],
    category: "owner",
    description: "Displays the list of servers the bot is in!",
    usage: " ",
    accessableby: "Owner"
  },
  run: async (bot, message, args) => {
    const ownerIds = ["725260858028195892"];

    if (!ownerIds.includes(message.author.id)) {
      return;
    }

    if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("<a:deny:892076004183506954> | I don't have the necessary permissions.").then(msg => msg.delete({ timeout: 5000 }));
    }

    const guildId = args[0];

    if (!guildId) {
      return message.channel.send("<a:deny:892076004183506954> | Please provide a server ID.");
    }

    const guild = bot.guilds.cache.find((g) => g.id === guildId);

    if (!guild) {
      return message.channel.send("<a:deny:892076004183506954> | The specified guild was not found.");
    }

    try {
      await guild.leave();
      message.channel.send(`<a:check:892071687250673664> | Successfully left guild: **${guild.name}**`);
    } catch (e) {
      console.error(e);
      return message.channel.send("<a:deny:892076004183506954> | An error occurred while leaving that guild.");
    }
  }
};
