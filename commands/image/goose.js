const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = {
  config: {
    name: "goose",
    noalias: [''],
    category: "image",
    description: "Shows random goose image",
    usage: "",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let victim =
      message.mentions.users.first() ||
      message.client.users.cache.find(
        (e) => e.username.toLowerCase().includes(args.join(" ").toLowerCase())
      ) ||
      message.author;

    try {
      const { body } = await superagent.get("https://nekos.life/api/v2/img/goose");
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Here's your Goose Image 🤗")
        .setImage(body.url)
        .setTimestamp()
        .setFooter('© RXNationBot | 2020 - 2023');

      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      message.channel.send("**An error occurred while fetching the goose image.**");
    }
  }
};
