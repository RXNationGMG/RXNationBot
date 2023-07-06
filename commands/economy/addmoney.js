const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  config: {
    name: "addmoney",
    aliases: ["am"],
    category: "economy",
    description: "Adds money to a user",
    usage: "[mention | ID]",
    accessableby: "Administrator, Owner",
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send(
        "You do not have permissions to add money! - [ADMINISTRATOR]"
      );
    }

    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a user!**");
    }

    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        (r) => r.displayName.toLowerCase() === args[0].toLocaleLowerCase()
      );

    if (!user) {
      return message.channel.send("**<a:deny:892076004183506954> | Enter a valid user!**");
    }

    if (!args[1]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter an amount!**");
    }

    if (isNaN(args[1])) {
      return message.channel.send(`**<a:deny:892076004183506954> | Your amount is not a number!**`);
    }

    if (args[1] > 10000) {
      return message.channel.send("**<a:deny:892076004183506954> | Cannot add that much amount!**");
    }

    db.add(`money_${user.id}`, args[1]);
    let bal = db.fetch(`money_${user.id}`);

    let moneyEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<a:check:892071687250673664> | Added ${args[1]} coins\n\nNew Balance: ${bal}`);

    message.channel.send(moneyEmbed);
  },
};
