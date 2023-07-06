const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "phcomment",
    aliases: ['phc'],
    category: "image",
    description: "Shows PH Comment",
    usage: '[text]',
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = message.mentions.members.first();
    let text = args.join(" ");

    if (user) {
      text = args.slice(1).join(" ");
    } else {
      user = message.author;
    }

    if (!text) {
      return message.channel.send("**<a:deny:892076004183506954> | Enter Text!**");
    }

    try {
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=phcomment&username=${user.username}&image=${user.displayAvatarURL({ format: "png", size: 512 })}&text=${text}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "phcomment.png");
      message.channel.send(attachment);
    } catch (error) {
      console.error(error);
      return message.channel.send("<a:deny:892076004183506954> | Error occurred while generating PH comment! Please try again.");
    }
  }
};
