const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
  config: {
    name: "addrole",
    aliases: ["ar"],
    description: "Adds role to a user",
    category: "moderation",
    usage: "[name | nickname | mention | ID] <role>",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    const manageRolesPermission = message.member.hasPermission("MANAGE_ROLES");
    const manageRolesPermissionMe = message.guild.me.hasPermission("MANAGE_ROLES");

    if (!manageRolesPermission) {
      return message.channel.send("**<a:deny:892076004183506954> | You don't have the permissions to add roles to users! - [MANAGE_ROLES]**");
    }

    if (!manageRolesPermissionMe) {
      return message.channel.send("**<a:deny:892076004183506954> | I don't have the permissions to add roles to users! - [MANAGE_ROLES]**");
    }

    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a role!**");
    }

    let rMember = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
      message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());

    if (!rMember) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a username!**");
    }

    if (rMember.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
      return message.channel.send('**<a:deny:892076004183506954> Cannot add role to this user!**');
    }

    let role = message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find(rp => rp.name.toLowerCase() === args.slice(1).join(' ').toLocaleLowerCase());

    if (!args[1]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a role!**");
    }

    if (!role) {
      return message.channel.send("**<a:deny:892076004183506954> | Could not find that role!**");
    }

    if (role.managed) {
      return message.channel.send("**<a:deny:892076004183506954> | Cannot add that role to the user!**");
    }

    if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) {
      return message.channel.send('**<a:deny:892076004183506954> | Role is currently higher than me, therefore cannot add it to the user!**');
    }

    if (rMember.roles.cache.has(role.id)) {
      return message.channel.send("**<a:deny:892076004183506954> | User already has the role!**");
    }

    try {
      await rMember.roles.add(role.id);
    } catch (error) {
      console.error(error);
      return message.channel.send("<a:deny:892076004183506954> | An error occurred while adding the role.");
    }

    var sembed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(`<a:check:892071687250673664> | Role has been added to ${rMember.user.username}`);

    message.channel.send(sembed);

    let channel = db.fetch(`modlog_${message.guild.id}`);
    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
      .setColor("RANDOM")
      .setThumbnail(rMember.user.displayAvatarURL({ dynamic: true }))
      .setFooter(message.guild.name, message.guild.iconURL())
      .addField("**Moderation**", "addrole")
      .addField("**Added Role to**", rMember.user.username)
      .addField("**Role Added**", role.name)
      .addField("**Added By**", message.author.username)
      .addField("**Date**", message.createdAt.toLocaleString())
      .setTimestamp();

    let sChannel = message.guild.channels.cache.get(channel);
    if (sChannel) {
      sChannel.send(embed);
    }
  },
};
