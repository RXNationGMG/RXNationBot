const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
    config: {
        name: "waifu",
        noalias: [''],
        category: "anime",
        description: "Shows a random waifu image",
        usage: "",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {

  let victim = message.mentions.users.first() || (args.length > 0 ? message.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  const { body } = await superagent
    .get("https://nekos.life/api/v2/img/waifu");
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Here's your Waifu Image 🤗")
        .setImage(body.url)
        .setTimestamp()
        .setFooter('© RXNationBot | 2020 - 2023');
         message.channel.send(embed);
    }
}
