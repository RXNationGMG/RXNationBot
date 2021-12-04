const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
    config: {
        name: "ravatar",
        noalias: [''],
        category: "anime",
        description: "Shows random ravatar image",
        usage: "",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

  let victim = message.mentions.users.first() || (args.length > 0 ? message.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  const { body } = await superagent
    .get("https://nekos.life/api/v2/img/ravatar");
        const embed = new MessageEmbed()
        .setColor("FF0000")
        .setTitle("Here's your RAVATAR 🤗")
        .setImage(body.url)
        .setTimestamp()
        .setFooter('© RXNationBot');
         message.channel.send(embed);
    }
}
