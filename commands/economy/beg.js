const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports = {
  config: {
    name: "beg",
    noalias: [""],
    category: "economy",
    description: "Beg for money",
    usage: "",
    accessableby: "everyone",
  },
  run: async (bot, message, args) => {
    let user = message.author;

    let timeout = 120000;
    let amount = 29972;

    let lastBeg = await db.fetch(`beg_${user.id}`);

    if (lastBeg !== null && Date.now() - lastBeg < timeout) {
      let time = ms(timeout - (Date.now() - lastBeg));

      let timeEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `<a:deny:892076004183506954> | You've already begged recently\n\nBeg again in ${time.minutes}m ${time.seconds}s`
        );

      return message.channel.send(timeEmbed);
    }

    let moneyEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `You've begged someone and received ${amount} coins!`
      );

    message.channel.send(moneyEmbed);
    db.add(`money_${user.id}`, amount);
    db.add(`begs_${user.id}`, 1);
    db.set(`beg_${user.id}`, Date.now());
  },
};
