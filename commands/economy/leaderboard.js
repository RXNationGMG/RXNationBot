const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  config: {
    name: "leaderboard",
    aliases: ['lb'],
    category: 'economy',
    description: 'Shows Server\'s Top 10 Users of Economy Leaderboard',
    usage: ' ',
    accessableby: "everyone"
  },
run: async (bot, message, args) => {
  let money = db.all()
    .filter(data => data && data.data && data.data.ID && data.data.ID.startsWith(`money_`))
    .sort((a, b) => b.data - a.data);

  if (!money.length) {
    let noEmbed = new MessageEmbed()
      .setAuthor(message.member.displayName, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setFooter("Nothing To See Here Yet!");

    return message.channel.send(noEmbed);
  }

  money.length = 10;
  let finalLb = "";

  for (let i = 0; i < money.length; i++) {
    const user = bot.users.cache.get(money[i].data.ID.split('_')[1]) || "RXNationGaming#2896";
    const data = money[i].data.data !== null ? money[i].data.data : 0; // Check if data is null and replace with 0
    finalLb += `**${i + 1}. ${user.tag}** - ${data} :dollar:\n`;
  }

  const embed = new MessageEmbed()
    .setTitle(`Leaderboard Of ${message.guild.name}`)
    .setColor("RANDOM");

  if (finalLb) {
    embed.setDescription(finalLb);
  } else {
    embed.setDescription("No leaderboard data available");
  }

  embed.setFooter(bot.user.tag, bot.user.displayAvatarURL())
    .setTimestamp();

  message.channel.send(embed);
}
};
