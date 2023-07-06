const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
  config: {
    name: "removerole",
    category: "moderation",
    aliases: ["rvr"],
    description: "Removes role from the user",
    accessableby: "Administrator",
    usage: "[name | nickname | mention | ID] <role>",
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("MANAGE_ROLES")) {
        return message.channel.send("**<a:deny:892076004183506954> | You don't have the permissions to remove roles from users! - [MANAGE_ROLES]**");
      }

      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return message.channel.send("**<a:deny:892076004183506954> | I don't have the permissions to remove roles from users! - [MANAGE_ROLES]**");
      }

      if (!args[0]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a user!**");
      }

      const rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      if (!rMember) {
        return message.channel.send("**<a:deny:892076004183506954> | Couldn't find that user**");
      }

      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(rp => rp.name.toLowerCase() === args.slice(1).join(' ').toLocaleLowerCase());
      if (!args[1]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a role!**");
      }

      if (!role) {
        return message.channel.send("**<a:deny:892076004183506954> | Couldn't find that role**");
      }

      if (rMember.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
        return message.channel.send('**<a:deny:892076004183506954> | Cannot remove role from this user! - [Higher than me in role hierarchy]**');
      }

      if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
        return message.channel.send('**<a:deny:892076004183506954> | Role is currently higher than me, therefore cannot remove it from the user!**');
      }

      if (role.managed) {
        return message.channel.send("**<a:deny:892076004183506954> | Cannot remove that role from this user!**");
      }

      if (!rMember.roles.cache.has(role.id)) {
        return message.channel.send("**<a:deny:892076004183506954> | User doesn't have the role!**");
      }

      await rMember.roles.remove(role.id);

      const sembed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`<a:check:892071687250673664> | Role has been removed from ${rMember.user.username}`);

      message.channel.send(sembed);

      const channel = db.fetch(`modlog_${message.guild.id}`);
      if (channel) {
        const embed = new MessageEmbed()
          .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
          .setColor("RANDOM")
          .setThumbnail(rMember.user.displayAvatarURL({ dynamic: true }))
          .setFooter(message.guild.name, message.guild.iconURL())
          .addField("**Moderation**", "removerole")
          .addField("**Removed Role from**", rMember.user.username)
          .addField("**Role Added**", role.name)
          .addField("**Removed By**", message.author.username)
          .addField("**Date**", message.createdAt.toLocaleString())
          .setTimestamp();

        const sChannel = message.guild.channels.cache.get(channel);
        if (sChannel) {
          sChannel.send(embed);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
