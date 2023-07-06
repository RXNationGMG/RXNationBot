const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  config: {
    name: "captcha",
    noalias: [''],
    category: "image",
    description: "Shows Captcha Image Of An User",
    usage: "[username | nickname | mention | ID](optional)",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const user = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) ||
      message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) ||
      message.member;

    const m = await message.channel.send("**<a:backup:892076096084901919> | Please Wait**");

    try {
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=captcha&username=${user.user.username}&url=${user.user.displayAvatarURL({ format: "png", size: 512 })}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "captcha.png");
      message.channel.send(attachment);
      m.delete({ timeout: 5000 });
    } catch (e) {
      console.log(e);
      m.edit("<a:deny:892076004183506954> | Error, Try Again! Mention Someone");
    }
  }
};
