const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: "sell",
    noalias: [""],
    category: "economy",
    description: "Sell to somebody",
    usage: "[mention | ID] <amount>",
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
    let item = args.join(' ').toLowerCase();

    if (item === 'nikes') {
      let nikees = await db.fetch(`nikes_${user.id}`);

      if (nikees < 1) {
        let embed1 = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`<a:deny:892076004183506954> | You don't have Nikes to sell`);

        return message.channel.send(embed1);
      }

      db.subtract(`nikes_${user.id}`, 1);
      db.add(`money_${user.id}`, 600);

      let embed2 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:check:892071687250673664> | Sold Fresh Nikes For 600 Coins`);

      message.channel.send(embed2);
    } else if (item === 'car') {
      let cars = await db.fetch(`car_${user.id}`);

      if (cars < 1) {
        let embed3 = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`<a:deny:892076004183506954> | You don't have a Car to sell`);

        return message.channel.send(embed3);
      }

      db.subtract(`car_${user.id}`, 1);
      db.add(`money_${user.id}`, 800);

      let embed4 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:check:892071687250673664> | Sold a Car For 800 Coins`);

      message.channel.send(embed4);
    } else if (item === 'mansion') {
      let houses = await db.fetch(`house_${user.id}`);

      if (houses < 1) {
        let sembed2 = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`<a:deny:892076004183506954> | You don't have a Mansion to sell`);

        return message.channel.send(sembed2);
      }

      db.subtract(`house_${user.id}`, 1);
      db.add(`money_${user.id}`, 1200);

      let sembed3 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:check:892071687250673664> | Sold a Mansion For 1200 Coins`);

      message.channel.send(sembed3);
    } else {
      let embed9 = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | Not a valid item! Type \`${prefix}store\` to see the list of items`);

      return message.channel.send(embed9);
    }
  }
};
