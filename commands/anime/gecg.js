const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
  config: {
    name: "gecg",
    noalias: [''],
    category: "anime",
    description: "Shows a random gecg image",
    usage: "",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let victim = message.mentions.users.first() || (args.length > 0 ? message.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first() : message.author);

    const { body } = await superagent.get("https://nekos.life/api/v2/img/gecg");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Here's your Gecg Image 🤗")
      .setImage(body.url)
      .setTimestamp()
      .setFooter('© RXNationBot | 2020 - 2023');

    message.channel.send(embed);
  }
};
