const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "tweet",
    noalias: [''],
    category: "image",
    description: "Sends A Tweet",
    usage: "[username] <text>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = args[0];
    let text = args.slice(1).join(" ");

    if (!user) {
      return message.channel.send("**<a:deny:892076004183506954> | You Have To Enter Someone's Twitter Nickname!**");
    }

    if (!text) {
      return message.channel.send("**<a:deny:892076004183506954> | You must enter a message!**");
    }

    try {
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "tweet.png");
      await message.channel.send(`**New tweet published by ${user}**`, attachment);
    } catch (error) {
      console.error(error);
      return message.channel.send("<a:deny:892076004183506954> | Error occurred while generating tweet! Please try again.");
    }
  }
};
