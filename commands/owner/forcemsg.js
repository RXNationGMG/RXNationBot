const Discord = require("discord.js");
const ownerid = ["725260858028195892"];
const ownerid2 = ["725260858028195892"];
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "forcemessage",
    aliases: ["forcemsg"],
    category: "owner",
    description: "Only owners loiek me xd",
    usage: " ",
    accessableby: "Owner"
  },
  run: async (bot, message, args) => {
    if (message.author.id == ownerid || ownerid2) {
      message.delete();
          let channel = message.mentions.channels.first()
    if(!channel) {
        return message.channel.send(`<a:deny:892076004183506954> mention channel please!`);
    }

    var args = message.content.split(' ').slice(2).join(' ');
 if(!args) {
     return message.channel.send(`<a:deny:892076004183506954> you must spefic the message u want to send!`)
 }
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Message From The Bot Owner!!")
        .setDescription(args)
        .setTimestamp()
        .setFooter('© RXNationBot');
channel.send(embed)
    }
  }
};
