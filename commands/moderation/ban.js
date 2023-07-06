const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
  config: {
    name: "ban",
    aliases: ["b", "banish", "bye", "shallnotpass"],
    category: "moderation",
    description: "Bans the user in the server!",
    usage: "[name | nickname | mention | ID] <reason> (optional)",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("BAN_MEMBERS")) {
        return message.channel.send("**<a:deny:892076004183506954> | You don't have the permissions to ban users! - [BAN_MEMBERS]**");
      }
      
      if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        return message.channel.send("**<a:deny:892076004183506954> | I don't have the permissions to ban users! - [BAN_MEMBERS]**");
      }

      if (!args[0]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please provide a user to ban!**");
      }

      let banMember = message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
        message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

      if (!banMember) {
        return message.channel.send("**<a:deny:892076004183506954> | User is not in the guild**");
      }

      if (banMember === message.member) {
        return message.channel.send("**<a:deny:892076004183506954> | You cannot ban yourself**");
      }

      var reason = args.slice(1).join(" ");

      if (!banMember.bannable) {
        return message.channel.send("**<a:deny:892076004183506954> | Cannot ban that user**");
      }

      await banMember.send(`**Hello User, You Have Been Banned From ${message.guild.name} for - ${reason || "No Reason"}**`).catch(() => null);

      await message.guild.members.ban(banMember, { days: 7, reason: reason });

      var sembed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`**${banMember.user.username}** has been banned${reason ? ` for ${reason}` : ""}`);

      message.channel.send(sembed);

      let channel = db.fetch(`modlog_${message.guild.id}`);
      if (channel) {
        const embed = new MessageEmbed()
          .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
          .setColor("RANDOM")
          .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
          .setFooter(message.guild.name, message.guild.iconURL())
          .addField("**Moderation**", "ban")
          .addField("**Banned**", banMember.user.username)
          .addField("**ID**", banMember.id)
          .addField("**Banned By**", message.author.username)
          .addField("**Reason**", reason || "**No Reason**")
          .addField("**Date**", message.createdAt.toLocaleString())
          .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel);
        if (sChannel) {
          sChannel.send(embed);
        }
      }
    } catch (e) {
      return message.channel.send(`**${e.message}**`);
    }
  }
};
