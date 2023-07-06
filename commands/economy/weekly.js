const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports = {
  config: {
    name: "coins-system",
    aliases: ["week"],
    category: "economy",
    description: "Gives You 100000 per Day",
    usage: " ",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const user = message.author;
    const timeout = 604800000;
    const amount = 100000;

    const lastWeekly = await db.fetch(`weekly_${user.id}`);
    if (lastWeekly !== null && timeout - (Date.now() - lastWeekly) > 0) {
      const time = ms(timeout - (Date.now() - lastWeekly));

      const timeEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:deny:892076004183506954> | You have already collected your weekly reward\n\nCollect it again in ${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`);
      message.channel.send(timeEmbed);
    } else {
      const moneyEmbed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<a:check:892071687250673664> | You've collected your weekly reward of ${amount} coins`);
      message.channel.send(moneyEmbed);
      db.add(`money_${user.id}`, amount);
      db.set(`weekly_${user.id}`, Date.now());
    }
  }
};
