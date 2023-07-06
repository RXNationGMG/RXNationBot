const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
  config: {
    name: "giveaway",
    description: "Creating giveaway",
    accessableby: "Administrator",
    category: "giveaway",
    aliases: ["gstart"],
    usage: '<channel> <duration> <winners> <prize>'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return message.channel.send('<a:deny:892076004183506954> | You need to have the "Manage Messages" permissions to start giveaways.');
    }

    const giveawayChannel = message.mentions.channels.first();

    if (!giveawayChannel) {
      return message.channel.send('<a:deny:892076004183506954> | You have to mention a valid channel!');
    }

    const giveawayDuration = args[1];

    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      return message.channel.send('<a:deny:892076004183506954> | You have to specify a valid duration!');
    }

    const giveawayNumberWinners = args[2];

    if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
      return message.channel.send('<a:deny:892076004183506954> | You have to specify a valid number of winners!');
    }

    const giveawayPrize = args.slice(3).join(' ');

    if (!giveawayPrize) {
      return message.channel.send('<a:deny:892076004183506954> | You have to specify a valid prize!');
    }

    bot.giveawaysManager.start(giveawayChannel, {
      time: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: parseInt(giveawayNumberWinners),
      hostedBy: message.author,
      messages: {
        giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
        giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: "React with 🎉 to participate!",
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false
        }
      }
    });

    message.channel.send(`<a:check:892071687250673664> | Giveaway successfully started in ${giveawayChannel}!`);
  }
};
