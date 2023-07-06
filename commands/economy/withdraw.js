const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  config: {
    name: "withdraw",
    aliases: ["wd"],
    category: "economy",
    description: "Withdraws Money From Bank",
    usage: "<amount>"
  },
  run: async (bot, message, args) => {
    const user = message.author;

    const bankBalance = db.fetch(`bank_${user.id}`);
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription("<a:deny:892076004183506954> | Specify an amount to withdraw!");
      return message.channel.send(embed);
    }

    const amountToWithdraw = parseInt(args[0]);
    if (isNaN(amountToWithdraw)) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription("<a:deny:892076004183506954> | Your Amount Is Not A Number!");
      return message.channel.send(embed);
    }

    if (amountToWithdraw <= 0) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription("<a:deny:892076004183506954> | You can't withdraw negative money!");
      return message.channel.send(embed);
    }

    if (!bankBalance || bankBalance < amountToWithdraw) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription("<a:deny:892076004183506954> | You don't have that much money in the bank!");
      return message.channel.send(embed);
    }

    db.subtract(`bank_${user.id}`, amountToWithdraw);
    db.add(`money_${user.id}`, amountToWithdraw);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<a:check:892071687250673664> | You have withdrawn ${amountToWithdraw} coins from your bank!`);
    message.channel.send(embed);
  }
};
