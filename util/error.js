const { MessageEmbed } = require("discord.js");

/**
 * Easy to send errors because im lazy to do the same things :p
 * @param {String} text - Message which is need to send
 * @param {TextChannel} channel - A Channel to send error
 */

module.exports = async (text, channel) => {
  const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(text)
    .setFooter("Oops something went wrong! :(");

  await channel.send(embed);
};
