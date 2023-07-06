const Canvas = require("canvas");
const Discord = require("discord.js");

module.exports = {
  config: {
    name: "facepalm",
    aliases: ['fp'],
    category: 'image',
    description: "Shows Facepalmed User",
    usage: "[username | nickname | mention | ID] (optional)",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    const m = await message.channel.send("**Please Wait <a:backup:892076096084901919>**");

    const canvas = Canvas.createCanvas(632, 357);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 632, 357);

    const avatar = await Canvas.loadImage(user.user.displayAvatarURL({ format: "png", size: 512 }));
    ctx.drawImage(avatar, 199, 112, 235, 235);

    const layer = await Canvas.loadImage('https://raw.githubusercontent.com/Androz2091/AtlantaBot/master/assets/img/facepalm.png');
    ctx.drawImage(layer, 0, 0, 632, 357);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "facepalm.png");

    m.delete({ timeout: 5000 });
    message.channel.send(attachment);
  }
};
