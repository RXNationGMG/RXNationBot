const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
const db = require("quick.db");
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "slots",
    aliases: ["sl"],
    category: "economy",
    description: "Slot game | 9x - rare | 3x - common",
    usage: "<amount>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = message.author;
    let moneydb = await db.fetch(`money_${user.id}`);
    let money = parseInt(args[0]);
    let win = false;

    if (!money) {
      let moneyhelp = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | Specify an amount`);
      return message.channel.send(moneyhelp);
    }

    if (money > moneydb) {
      let moneymore = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | You are betting more than you have`);
      return message.channel.send(moneymore);
    }

    let number = [];
    for (let i = 0; i < 3; i++) {
      number[i] = Math.floor(Math.random() * slotItems.length);
    }

    if (number[0] == number[1] && number[1] == number[2]) {
      money *= 9;
      win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
      money *= 3;
      win = true;
    }

    if (win) {
      let slotsEmbed1 = new MessageEmbed()
        .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou won ${money} coins`)
        .setColor("RANDOM");
      message.channel.send(slotsEmbed1);
      db.add(`money_${user.id}`, money);
    } else {
      let slotsEmbed = new MessageEmbed()
        .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou lost ${money} coins`)
        .setColor("RANDOM");
      message.channel.send(slotsEmbed);
      db.subtract(`money_${user.id}`, money);
    }
  }
};
