const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  config: {
    name: "setnick",
    aliases: ["sn"],
    category: "moderation",
    description: "Sets or changes the nickname of a user",
    usage: "[mention | name | nickname | ID] <nickname>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
        return message.channel.send("**<a:deny:892076004183506954> | You don't have permissions to change the nickname! - [MANAGE_GUILD]**");
      }

      if (!message.guild.me.hasPermission("CHANGE_NICKNAME")) {
        return message.channel.send("**<a:deny:892076004183506954> | I don't have permissions to change the nickname! - [CHANGE_NICKNAME]**");
      }

      if (!args[0]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a user!**");
      }

      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) ||
        message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLowerCase()) ||
        message.member;

      if (!member) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a valid username!**");
      }

      if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
        return message.channel.send("**<a:deny:892076004183506954> | Cannot set or change the nickname of this user!**");
      }

      if (!args[1]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a nickname!**");
      }

      let nick = args.slice(1).join(' ');

      member.setNickname(nick);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`**<a:check:892071687250673664> | Changed the nickname of ${member.displayName} to ${nick}**`)
        .setAuthor(message.guild.name, message.guild.iconURL());

      message.channel.send(embed);

      let channel = db.fetch(`modlog_${message.guild.id}`);
      if (channel) {
        const sembed = new MessageEmbed()
          .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
          .setColor("RANDOM")
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setFooter(message.guild.name, message.guild.iconURL())
          .addField("**Moderation**", "setnick")
          .addField("**Nick Changed Of**", member.user.username)
          .addField("**Nick Changed By**", message.author.username)
          .addField("**Nick Changed To**", args[1])
          .addField("**Date**", message.createdAt.toLocaleString())
          .setTimestamp();

        const sChannel = message.guild.channels.cache.get(channel);
        if (sChannel) {
          sChannel.send(sembed);
        }
      }
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Missing permissions - [CHANGE_NICKNAME]**");
    }
  }
};
