const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: "buy",
    noalias: [""],
    category: "economy",
    description: "Buys items",
    usage: "[item]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = message.author;
    let prefix = db.fetch(`prefix_${message.guild.id}`) || PREFIX;
    let author = db.fetch(`money_${user.id}`);

    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `Enter an item to buy!\nType ${prefix}store to see the list of items!`
        );

      return message.channel.send(embed);
    }

    const items = {
      bronze: { name: "Bronze VIP", price: 200, key: "bronze" },
      nikes: { name: "Nikes", price: 600, key: "nikes" },
      car: { name: "Car", price: 800, key: "car" },
      mansion: { name: "Mansion", price: 1200, key: "house" }
    };

    const itemName = args[0].toLowerCase();
    const item = items[itemName];

    if (!item) {
      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | That item is not available for purchase!`);

      return message.channel.send(embed);
    }

    const { name, price, key } = item;

    if (author < price) {
      let embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | You need ${price} coins to purchase ${name}`);

      return message.channel.send(embed);
    }

    await db.fetch(`${key}_${user.id}`);
    db.add(`${key}_${user.id}`, 1);
    db.subtract(`money_${user.id}`, price);

    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<a:check:892071687250673664> | Purchased ${name} for ${price} coins`);

    message.channel.send(embed);
  }
};
