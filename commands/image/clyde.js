const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  config: {
    name: "clyde",
    noalias: [''],
    category: "image",
    description: "Shows Embed Send By Clyde Bot",
    usage: "<text>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const text = args.join(" ");

    if (!text) {
      return message.channel.send("**<a:warn:891035320030724196> | Enter Your Text**");
    }

    const m = await message.channel.send("**<a:backup:892076096084901919> | Please Wait**");

    try {
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "clyde.png");
      message.channel.send(attachment);
      m.delete({ timeout: 5000 });
    } catch (e) {
      m.edit(e.message);
    }
  }
};
