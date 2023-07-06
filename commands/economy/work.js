const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const ms = require("parse-ms");
const Jwork = require('../../JSON/works.json');

module.exports = {
  config: {
    name: "work",
    aliases: ["wr"],
    category: "economy",
    description: "Work to Earn Money",
    usage: " ",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const user = message.author;
    const author = await db.fetch(`work_${user.id}`);

    const timeout = 1800000;

    if (author !== null && timeout - (Date.now() - author) > 0) {
      const time = ms(timeout - (Date.now() - author));

      const timeEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | You have already worked recently\n\nTry again in ${time.minutes}m ${time.seconds}s`);
      return message.channel.send(timeEmbed);
    }

    const randomWork = Jwork[Math.floor(Math.random() * Jwork.length)];
    const amount = Math.floor(Math.random() * 80) + 1;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`<a:check:892071687250673664> | **${randomWork} ${amount}**`);
    message.channel.send(embed);

    db.add(`works_${user.id}`, 1);
    db.add(`money_${user.id}`, amount);
    db.set(`work_${user.id}`, Date.now());
  }
};
