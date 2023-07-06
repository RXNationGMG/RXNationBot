const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal"],
    category: "economy",
    description: "Shows current balance",
    usage: "[username | nickname | mention | ID] (optional)",
    accessableby: "everyone",
  },
  run: async (bot, message, args) => {
    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (r) =>
          r.user.username.toLowerCase() === args.join(" ").toLowerCase()
      ) ||
      message.guild.members.cache.find(
        (r) => r.displayName.toLowerCase() === args.join(" ").toLowerCase()
      ) ||
      message.member;

    let bal = db.fetch(`money_${user.id}`) || 0;
    let bank = db.fetch(`bank_${user.id}`) || 0;

    let moneyEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `**${user.user.username}'s Balance**\n\nPocket: ${bal}\nBank: ${bank}`
      );

    message.channel.send(moneyEmbed);
  },
};
