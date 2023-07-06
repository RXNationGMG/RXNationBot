const db = require('quick.db');
const Discord = require('discord.js');
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: "myvouchs",
    aliases: [''],
    category: 'info',
    description: 'Showing your total vouchs',
    usage: '[mention]',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    let user = message.mentions.users.first() || message.author;
    let thanks = await db.get(`userthanks_${user.id}`);
    let thanksl = await db.get(`userthanks_${user.id}`);

    let level = "New";
    if (thanks > 100) level = "Level MAX";
    else if (thanks > 90) level = "Level 9";
    else if (thanks > 80) level = "Level 8";
    else if (thanks > 70) level = "Level 7";
    else if (thanks > 60) level = "Level 6";
    else if (thanks > 50) level = "Level 5";
    else if (thanks > 40) level = "Level 4";
    else if (thanks > 30) level = "Level 3";
    else if (thanks > 20) level = "Level 2";
    else if (thanks > 10) level = "Level 1";
    else if (thanks > 0) level = "Level 0";

    let embed = new Discord.MessageEmbed()
      .setAuthor(user.username, user.displayAvatarURL())
      .addField("User Level", level, true)
      .addField("User Total Vouchs", thanksl || '0', true)
      .setTimestamp()
      .setFooter(message.guild.name, message.guild.iconURL());

    message.channel.send(embed);
  }
};
 