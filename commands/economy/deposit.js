const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  config: {
    name: "deposit",
    aliases: ["dep"],
    category: "economy",
    description: "Deposits money to bank",
    usage: "<amount>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = message.author;
    let member = db.fetch(`money_${user.id}`);

    if (args[0] === 'all') {
      let money = db.fetch(`money_${user.id}`);

      let embedbank = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription("<a:deny:892076004183506954> | You don't have any money to deposit");

      if (!money) return message.channel.send(embedbank);

      db.subtract(`money_${user.id}`, money);
      db.add(`bank_${user.id}`, money);
      let sembed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:check:892071687250673664> | You have successfully deposited all your coins into your bank account!`);
      message.channel.send(sembed);
    } else {
      let amount = parseInt(args[0]);

      let embed2 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | Specify an amount to deposit`);

      if (isNaN(amount)) {
        return message.channel.send("<a:deny:892076004183506954> | Your Amount Is Not A Number!");
      }

      if (!args[0]) {
        return message.channel.send(embed2);
      }

      if (amount <= 0) {
        return message.channel.send("<a:deny:892076004183506954> | You can't deposit negative money");
      }

      if (member < amount) {
        return message.channel.send("<a:deny:892076004183506954> | You don't have that much money");
      }

      let embed5 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:check:892071687250673664> | You have deposited ${amount} coins into your bank`);

      message.channel.send(embed5);
      db.subtract(`money_${user.id}`, amount);
      db.add(`bank_${user.id}`, amount);
    }
  }
};
