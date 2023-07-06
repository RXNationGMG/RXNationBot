const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "love",
    noalias: [''],
    category: "image",
    description: "Shows Image of 2 Lovers, 3 persons!",
    usage: "[mention(1) | ID(1) | name(1) | nickname(1)] [mention(2) | ID(2) | name(2) | nickname(2)]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    if (args.length < 2) {
      return message.channel.send("**<a:deny:892076004183506954> | Error, Enter The Names of Two Lovers!**");
    }

    const user1 = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[0]?.toLocaleLowerCase()) || message.guild.members.cache.find(mp => mp.displayName.toLowerCase() === args[0]?.toLocaleLowerCase());
    const user2 = message.mentions.members.array()[1] || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args[1]?.toLocaleLowerCase()) || message.guild.members.cache.find(mp => mp.displayName.toLowerCase() === args[1]?.toLocaleLowerCase());

    if (!user1) return message.channel.send("**<a:deny:892076004183506954> | Please Enter a Valid User for the First Lover!**");
    if (!user2) return message.channel.send("**<a:deny:892076004183506954> | Please Enter a Valid User for the Second Lover!**");

    let m = await message.channel.send("**Please Wait...**");
    try {
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=ship&user1=${user1.user.displayAvatarURL({ format: "png", size: 512 })}&user2=${user2.user.displayAvatarURL({ format: "png", size: 512 })}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "love.png");
      message.channel.send(attachment);
      m.delete({ timeout: 5000 });
    } catch (error) {
      console.error(error);
      m.edit("<a:deny:892076004183506954> | Error, Please Try Again! Mention Someone");
    }
  }
};
