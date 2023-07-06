const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { chunk } = require('../../functions.js');

module.exports = {
  config: {
    name: "setinfo",
    aliases: ['setbio'],
    description: "Set Profile Description",
    category: 'economy',
    usage: '[info]',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    let user = message.author;
    if (!args[0]) {
      let fetchInfo = await db.fetch(`info_${user.id}`);
      if (fetchInfo) {
        let embed = new MessageEmbed()
          .setColor("RANDOM")
          .setAuthor('<a:deny:892076004183506954> | Info Is Already Set', message.author.displayAvatarURL())
          .setDescription(`**${fetchInfo}**`)
          .setFooter(message.guild.name, message.guild.iconURL());
        return message.channel.send(embed);
      }
    }

    let newInfo = args.join(' ');
    if (!newInfo) {
      return message.channel.send('**<a:deny:892076004183506954> | Please Enter Your Info!**');
    }

    if (newInfo.length > 165) {
      return message.channel.send(`**<a:deny:892076004183506954> | Max \`165\` Characters Allowed!**`);
    }

    let newsInfo = chunk(newInfo, 42).join('\n');
    db.set(`info_${user.id}`, newsInfo);

let notesEmbed = new MessageEmbed()
  .setColor("RANDOM")
  .setDescription(`<a:check:892071687250673664> | Your Info Box Has Been Set`)
  .addField("Info:", newsInfo)
  .setFooter(message.guild.name, message.guild.iconURL());

    message.channel.send(notesEmbed);
  }
};
