const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
  config: {
    name: "mute",
    description: "Mutes a member in the discord!",
    usage: "[name | nickname | mention | ID] <reason> (optional)",
    category: "moderation",
    accessableby: "Administrator",
    noalias: "No Aliases",
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("MANAGE_GUILD")) {
        return message.channel.send(
          "**<a:deny:892076004183506954> | You don't have permission to mute someone! - [MANAGE_GUILD]**"
        );
      }

      if (!message.guild.me.hasPermission("MANAGE_GUILD")) {
        return message.channel.send(
          "**<a:deny:892076004183506954> | I don't have permission to mute someone! - [MANAGE_GUILD]**"
        );
      }

      if (!args[0]) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a user to be muted!**");
      }

      const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      if (!mutee) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a valid user to be muted!**");
      }

      if (mutee === message.member) {
        return message.channel.send("**<a:deny:892076004183506954> | You cannot mute yourself!**");
      }

      if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
        return message.channel.send("**<a:deny:892076004183506954> | Cannot mute this user!**");
      }

      let reason = args.slice(1).join(" ");
      if (mutee.user.bot) {
        return message.channel.send("**<a:warn:891035320030724196> | Cannot mute bots!**");
      }

      const userRoles = mutee.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.id);

      let muterole = message.guild.roles.cache.find(r => r.name === "muted");
      if (!muterole) {
        try {
          muterole = await message.guild.roles.create({
            data: {
              name: "muted",
              color: "RANDOM",
              permissions: [],
            },
          });
          message.guild.channels.cache.forEach(async (channel) => {
            await channel.createOverwrite(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              SPEAK: false,
              CONNECT: false,
            });
          });
        } catch (e) {
          console.log(e);
        }
      }

      if (mutee.roles.cache.has(muterole.id)) {
        return message.channel.send("**<a:deny:892076004183506954> | User is already muted!**");
      }

      db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles);

      try {
        await mutee.roles.set([muterole.id]);
        await mutee.send(`**Hello User, You Have Been Muted In ${message.guild.name} for - ${reason || "No Reason"}**`);
      } catch {
        await mutee.roles.set([muterole.id]);
      }

      const sembed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`<a:check:892071687250673664> ${mutee.user.username} was successfully muted${reason ? ` for ${reason}` : ""}`);

      message.channel.send(sembed);

      let channel = db.fetch(`modlog_${message.guild.id}`);
      if (channel) {
        let embed = new MessageEmbed()
          .setColor(redlight)
          .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
          .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
          .addField("**Moderation**", "mute")
          .addField("**Mutee**", mutee.user.username)
          .addField("**Moderator**", message.author.username)
          .addField("**Reason**", reason || "**No Reason**")
          .addField("**Date**", message.createdAt.toLocaleString())
          .setFooter(message.member.displayName, message.author.displayAvatarURL())
          .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel);
        if (sChannel) {
          sChannel.send(embed);
        }
      }
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Failed to mute the user!**");
    }
  },
};
