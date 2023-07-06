const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "purge",
    aliases: ["delete", "clear", 'prune'],
    category: "moderation",
    description: "Deletes messages from a channel",
    usage: "delete [amount of messages]",
    accessableby: "Administrator"
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send("<a:deny:892076004183506954> | You don't have sufficient permissions! Required permission: `MANAGE_MESSAGES`");
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return message.channel.send("**<a:deny:892076004183506954> | Please supply a valid amount to delete messages!**");
    }

    if (amount <= 0 || amount > 100) {
      return message.channel.send("**<a:deny:892076004183506954> | Please supply a number between 1 and 100!**");
    }

    message.channel.bulkDelete(amount, true)
      .then((messages) => {
        message.channel.send(`**<a:check:892071687250673664> | Successfully deleted \`${messages.size}/${amount}\` messages**`)
          .then((msg) => msg.delete({ timeout: 2000 }));
      })
      .catch(() => null);

    const channel = db.fetch(`modlog_${message.guild.id}`);
    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
      .setColor("RANDOM")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter(message.guild.name, message.guild.iconURL())
      .addField("Moderation", "Purge")
      .addField("Messages", `${amount}`)
      .addField("Channel ID", `${message.channel.id}`)
      .addField("Used by:", message.author.username)
      .addField("Date", message.createdAt.toLocaleString())
      .setTimestamp();

    const sChannel = message.guild.channels.cache.get(channel);
    if (sChannel) {
      sChannel.send(embed);
    }
  }
};
