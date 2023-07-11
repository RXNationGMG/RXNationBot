const Discord = require("discord.js");
const PlayStore = require("google-play-scraper");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "playstore",
    aliases: ["googleplaystore", "googleps"],
    category: "info",
    description: "Show Playstore Application Information Of Your Given Name!",
    usage: "<Application Name>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      if (!args[0]) {
        return message.channel.send(
          "<a:deny:892076004183506954> | Please provide the name of the application to search, " +
            message.author.username +
            "!"
        );
      }

      const searchData = await PlayStore.search({
        term: args.join(" "),
        num: 1
      });

      if (searchData.length === 0) {
        return message.channel.send(
          "<a:deny:892076004183506954> | No application found, " + message.author.username + "!"
        );
      }

      const app = searchData[0];
      const $ = cheerio.load(app.summary);
      const cleanedDescription = $.text();

      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(app.icon)
        .setURL(app.url)
        .setTitle(app.title)
        .setDescription(cleanedDescription)
        .addField("App Price Status", app.free ? "Free" : "Paid", true) // Check if the app is free or paid
        .addField("Developer", app.developer, true)
        .addField("Score", app.scoreText, true)
        .setFooter("Requested By " + message.author.username)
        .setTimestamp();

      return message.channel.send(embed);
    } catch (error) {
      console.error(error);
      return message.channel.send(
        "<a:deny:892076004183506954> | An error occurred while searching for the application, " +
          message.author.username +
          "!"
      );
    }
  }
};
