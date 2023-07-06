const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "ping",
    description: "Displays User and Bot Latency",
    usage: "",
    noalias: "No Aliases",
    category: "info",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      const m = await message.channel.send("**Pinging, please wait...**");
      const ping = m.createdTimestamp - message.createdTimestamp;
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`<:hourglass_flowing_sand:699128011743690794> ${ping}\n\n💓 ${Math.round(bot.ws.ping)}`);
      await message.channel.send(embed);
      m.delete();
    } catch (error) {
      console.error(error);
    }
  }
};
