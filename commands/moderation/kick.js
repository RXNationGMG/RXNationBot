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
            if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("**<a:deny:892076004183506954> You Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**");
            if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send("**<a:deny:892076004183506954> I Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**");

            if (!args[0]) return message.channel.send('**<a:deny:892076004183506954> Enter A User To Kick!**')

            var kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!kickMember) return message.channel.send("**<a:deny:892076004183506954> This User Is Not In The Guild!**");

            if (kickMember.id === message.member.id) return message.channel.send("**<a:deny:892076004183506954> You Cannot Kick Yourself!**")

            if (!kickMember.kickable) return message.channel.send("**<a:deny:892076004183506954> Cannot Kick This User!**")
            if (kickMember.user.bot) return message.channel.send("**<a:deny:892076004183506954> You Cannot Kick A Bot! Are U Dumb!?!?!**")

            var reason = args.slice(1).join(" ");
            try {
                const sembed2 = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`**Hello User, You Have Been Kicked From ${message.guild.name} for - ${reason || "No Reason!"}**`)
                    .setFooter(message.guild.name, message.guild.iconURL())
                kickMember.send(sembed2).then(() =>
                    kickMember.kick()).catch(() => null)
            } catch {
                kickMember.kick()
            }
            if (reason) {
            var sembed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**<a:check:892071687250673664> ${kickMember.user.username}** has been kicked for ${reason}`)
            message.channel.send(sembed);
            } else {
                var sembed2 = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**<a:check:892071687250673664> ${kickMember.user.username}** has been kicked`)
            message.channel.send(sembed2);
            }
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (!channel) return;

            const embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .setColor("RANDOM")
                .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
                .setFooter(message.guild.name, message.guild.iconURL())
                .addField("**Moderation**", "kick")
                .addField("**User Kicked**", kickMember.user.username)
                .addField("**Kicked By**", message.author.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", message.createdAt.toLocaleString())
                .setTimestamp();

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
        } catch (e) {
            return message.channel.send(`**${e.message}**`)
        }
    }
}