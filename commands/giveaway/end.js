const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
  config: {
    name: "end",
    description: "Ending giveaway",
    accessableby: "Administrator",
    category: "giveaway",
    aliases: ["gend"],
    usage: '<giveawaymessageid>'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return message.channel.send('<a:deny:892076004183506954> | You need to have the manage messages permissions to reroll giveaways.');
    }

    if (!args[0]) {
      return message.channel.send('<a:deny:892076004183506954> | You have to specify a valid message ID!');
    }

    const giveaway = bot.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ') || g.messageID === args[0]);

    if (!giveaway) {
      return message.channel.send('Unable to find a giveaway for `' + args.join(' ') + '`.');
    }

    try {
      await bot.giveawaysManager.edit(giveaway.messageID, {
        setEndTimestamp: Date.now()
      });

      message.channel.send('<a:warn:891035320030724196> | Giveaway will end in less than ' + (bot.giveawaysManager.options.updateCountdownEvery / 1000) + ' seconds...');
    } catch (e) {
      if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)) {
        message.channel.send('<a:deny:892076004183506954> | This giveaway is already ended!');
      } else {
        console.error(e);
        message.channel.send('<a:deny:892076004183506954> | An error occurred.');
      }
    }
  }
};
