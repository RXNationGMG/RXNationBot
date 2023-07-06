const Discord = require('discord.js');

module.exports = {
  config: {
    name: "feedback",
    aliases: [],
    category: "info",
    description: "Sends Feedback",
    usage: "<stars> <text>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const feedbackChannel = bot.channels.cache.get("902124467248050226");
    const feedNumber = parseInt(args[0]);
    const feedStr = args.slice(1).join(" ");

    if (!feedStr) {
      return message.channel.send("<a:deny:892076004183506954> | You need to include the star rating and the feedback text.");
    }

    if (isNaN(feedNumber) || feedNumber <= 0 || feedNumber > 5) {
      return message.channel.send("<a:deny:892076004183506954> | Invalid star rating. Please choose a number between 1 and 5.");
    }

    const starArray = Array(feedNumber).fill("⭐");

    const embed = new Discord.MessageEmbed()
      .setTitle("New Review")
      .addField("Stars:", starArray.join(""))
      .addField("Comment:", feedStr)
      .addField("From:", message.author)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(message.guild.name);

    await feedbackChannel.send(embed);
    await message.channel.send("<a:check:892071687250673664> | Feedback successfully sent to the Bot Support Feedback Channel!");
  }
};
