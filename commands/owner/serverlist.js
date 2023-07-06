const Discord = require("discord.js");
const ownerIds = ["725260858028195892"];

module.exports = {
  config: {
    name: "serverlist",
    aliases: ["slt"],
    category: "owner",
    description: "Displays the list of servers the bot is in!",
    usage: " ",
    accessableby: "Owner"
  },
  run: async (bot, message, args) => {
    if (!ownerIds.includes(message.author.id)) return;

    if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
      return message.channel
        .send("<a:deny:892076004183506954> | I Dont Have Permissions")
        .then(msg => msg.delete({ timeout: 5000 }));
    }

    const guilds = bot.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .map(guild => `**${guild.name}** | ${guild.memberCount} Members\nID - ${guild.id}`)
      .join("\n");

    let i = 0;
    const pageSize = 10;
    const totalPages = Math.ceil(bot.guilds.cache.size / pageSize);

    let embed = new Discord.MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RANDOM")
      .setFooter(bot.user.username)
      .setTitle(`Page - ${i + 1}/${totalPages}`)
      .setDescription(`Total Servers - ${bot.guilds.cache.size}\n\n${guilds.slice(i * pageSize, (i + 1) * pageSize)}`);

    let msg = await message.channel.send(embed);

    await msg.react("⬅");
    await msg.react("➡");
    await msg.react("❌");

    const filter = (reaction, user) => user.id === message.author.id;
    const collector = msg.createReactionCollector(filter, { time: 60000 });

    collector.on("collect", async (reaction, user) => {
      switch (reaction._emoji.name) {
        case "⬅":
          i = Math.max(0, i - 1);
          break;
        case "➡":
          i = Math.min(totalPages - 1, i + 1);
          break;
        case "❌":
          return msg.delete();
      }

      const updatedEmbed = new Discord.MessageEmbed(embed)
        .setTitle(`Page - ${i + 1}/${totalPages}`)
        .setDescription(`Total Servers - ${bot.guilds.cache.size}\n\n${guilds.slice(i * pageSize, (i + 1) * pageSize)}`);

      msg.edit(updatedEmbed);
      reaction.users.remove(message.author.id);
    });
  }
};
