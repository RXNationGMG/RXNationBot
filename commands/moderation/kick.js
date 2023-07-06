const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
  config: {
    name: "kick",
    category: "moderation",
    description: "Kicks the user out of the server",
    accessableby: "Administrator",
    usage: "[name | nickname | mention | ID] <reason> (optional)",
    aliases: ["k"],
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("**<a:deny:892076004183506954> | You do not have permissions to kick members! - [KICK_MEMBERS]**");
      }

      if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("**<a:deny:892076004183506954> | I do not have permissions to kick members! - [KICK_MEMBERS]**");
      }

      const kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0]?.toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0]?.toLocaleLowerCase());
      if (!kickMember) {
        return message.channel.send("**<a:deny:892076004183506954> | This user is not in the guild!**");
      }

      if (kickMember.id === message.member.id) {
        return message.channel.send("**<a:warn:891035320030724196> | You cannot kick yourself!**");
      }

      if (!kickMember.kickable) {
        return message.channel.send("**<a:deny:892076004183506954> | Cannot kick this user!**");
      }

      if (kickMember.user.bot) {
        return message.channel.send("**<a:warn:891035320030724196> | You cannot kick a bot!**");
      }

      const reason = args.slice(1).join(" ");

      try {
        const kickEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`**Hello User, You Have Been Kicked From ${message.guild.name} for ${reason || "No Reason!"}**`)
          .setFooter(message.guild.name, message.guild.iconURL());

        await kickMember.send(kickEmbed);
      } catch {
        // Ignore errors if the user cannot receive DMs
      }

      await kickMember.kick();

      const kickEmbed2 = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`**<a:check:892071687250673664> | ${kickMember.user.username}** has been kicked${reason ? ` for ${reason}` : ""}`);

      message.channel.send(kickEmbed2);

      const modlogChannelId = db.fetch(`modlog_${message.guild.id}`);
      if (modlogChannelId) {
        const modlogChannel = message.guild.channels.cache.get(modlogChannelId);
        if (modlogChannel) {
          const kickEmbed3 = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor("RANDOM")
            .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter(message.guild.name, message.guild.iconURL())
            .addField("**Moderation**", "Kick")
            .addField("**User Kicked**", kickMember.user.username)
            .addField("**Kicked By**", message.author.username)
            .addField("**Reason**", reason || "**No Reason**")
            .addField("**Date**", message.createdAt.toLocaleString())
            .setTimestamp();

          modlogChannel.send(kickEmbed3);
        }
      }
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Something went wrong!**");
    }
  }
};
