const { MessageEmbed } = require('discord.js');
const { PREFIX } = require('../../config.js');
const db = require('quick.db');

module.exports = {
  config: {
    name: "store",
    noalias: [""],
    category: "economy",
    description: "Shows list of items",
    usage: " ",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (prefix === null) {
      prefix = PREFIX;
    }
    
    let embed = new MessageEmbed()
      .setDescription(`**VIP Ranks**\n\nBronze: 200 Coins [${prefix}buy/${prefix}sell bronze]\n\n**Lifestyle Items**\n\nFresh Nikes: 600 [${prefix}buy/${prefix}sell nikes]\nCar: 800 [${prefix}buy/${prefix}sell car]\nMansion: 1200 [${prefix}buy/${prefix}sell mansion]`)
      .setColor("RANDOM");
    message.channel.send(embed);
  }
};
