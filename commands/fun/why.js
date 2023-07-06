const { MessageEmbed } = require("discord.js");
const Random = require("srod-v2");

module.exports = {
  config: {
    name: "why",
    category: "fun",
    noalias: [''],
    description: "Sending random why",
    usage: "[text]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const Why = await Random.GetWhy("BLUE");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(Why)
      .setTimestamp();

    message.channel.send(embed);
  }
};
