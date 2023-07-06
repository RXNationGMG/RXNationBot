const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: "roulette",
    aliases: ["roul"],
    category: "economy",
    description: "Bet a colour to win or lose",
    usage: "[colour]<amount>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let prefix;
    let fetched = await db.fetch(`prefix_${message.guild.id}`);

    if (fetched === null) {
      prefix = PREFIX;
    } else {
      prefix = fetched;
    }

    let user = message.author;

    function isOdd(num) {
      return num % 2 === 1;
    }

    let colour = args[0];
    let money = parseInt(args[1]);
    let moneydb = await db.fetch(`money_${user.id}`);

    let moneyhelp = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `<a:deny:892076004183506954> | Specify an amount to gamble | ${prefix}roulette <color> <amount>`
      );

    let moneymore = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<a:deny:892076004183506954> | You are betting more than you have`);

    let colorbad = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `<a:deny:892076004183506954> | Specify a color | Red [1.5x] (normal) Black [2x] (hard) Green [15x](rare)`
      );

    if (!colour) {
      return message.channel.send(colorbad);
    }

    colour = colour.toLowerCase();

    if (!money) {
      return message.channel.send(moneyhelp);
    }

    if (money > moneydb) {
      return message.channel.send(moneymore);
    }

    if (colour === "b" || colour.includes("black")) {
      colour = 0;
    } else if (colour === "r" || colour.includes("red")) {
      colour = 1;
    } else if (colour === "g" || colour.includes("green")) {
      colour = 2;
    } else {
      return message.channel.send(colorbad);
    }

    let random = Math.floor(Math.random() * 10);

    if (random === 1 && colour === 2) {
      // Green
      money *= 15;
      db.add(`money_${user.id}`, money);
      let moneyEmbed1 = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(
          `You won ${money} coins\n\nMultiplier: 15x`
        );
      message.channel.send(moneyEmbed1);
    } else if (isOdd(random) && colour === 1) {
      // Red
      money = parseInt(money * 1.5);
      db.add(`money_${user.id}`, money);
      let moneyEmbed2 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`🔴 You won ${money} coins\n\nMultiplier: 1.5x`);
      message.channel.send(moneyEmbed2);
    } else if (!isOdd(random) && colour === 0) {
      // Black
      money = parseInt(money * 2);
      db.add(`money_${user.id}`, money);
      let moneyEmbed3 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`⬛ You won ${money} coins\n\nMultiplier: 2x`);
      message.channel.send(moneyEmbed3);
    } else {
      // Wrong
      db.subtract(`money_${user.id}`, money);
      let moneyEmbed4 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:warn:891035320030724196> | You lost ${money} coins\n\nMultiplier: 0x`);
      message.channel.send(moneyEmbed4);
    }

    db.add(`games_${user.id}`, 1);
  }
};
