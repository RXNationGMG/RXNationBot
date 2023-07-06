const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  config: {
    name: "advice",
    category: "fun",
    noalias: [''],
    description: "Sending random advice",
    usage: "[text]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      const advice = response.data.slip.advice;

      const embed = new MessageEmbed()
        .setColor("BLUE")
        .setDescription(advice);
      message.channel.send(embed);
    } catch (error) {
      console.log(error);
      message.channel.send("<a:deny:892076004183506954> | An error occurred while fetching advice.");
    }
  }
};
