const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");
const yaml = require("js-yaml");
const backup = require("discord-backup");
const { PREFIX } = require("../../config.js");

const { attention, permission, yes } = yaml.load(fs.readFileSync("./config.yml"));

module.exports = {
  config: {
    name: "backup-load",
    description: "Load your guild's backup",
    accessableby: "Administrator",
    category: "backup",
    aliases: [],
    usage: "",
  },
  run: async (client, message, args) => {
    const guildicon2 = message.guild.iconURL();

    if (!message.member.hasPermission("ADMINISTRATOR", "MANAGE_GUILD")) {
      let permissionsembed = new Discord.MessageEmbed()
        .setTitle(`${no} **Missing Permissions**`)
        .setDescription(`${no} You must have [ADMINISTRATOR, MANAGE_GUILD] permissions to use this command!`)
        .setFooter(message.guild.name, client.user.displayAvatarURL());

      return message.channel.send(permissionsembed);
    }

    let backupID = args[0];
    if (!backupID) {
      let specifyIDEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`${no} You must specify a valid backup ID!`)
        .setFooter(message.guild.name, guildicon2);

      return message.channel.send(specifyIDEmbed);
    }

    try {
      const backupInfos = await backup.fetch(backupID);

      let prefix;
      let fetched = await db.fetch(`prefix_${message.guild.id}`);

      if (fetched === null) {
        prefix = PREFIX;
      } else {
        prefix = fetched;
      }

      let warning = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`${attention} | When the backup is loaded, all the channels, roles, etc. will be replaced! Type **${prefix}confirm** to confirm!!`)
        .setFooter(message.guild.name, guildicon2);

      message.channel.send(warning);

      await message.channel.awaitMessages((m) => m.author.id === message.author.id && m.content === prefix + "confirm", {
        max: 1,
        time: 20000,
        errors: ["time"],
      }).catch((err) => {
        let timeIsUpEmbed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`${attention} | Time's up! Cancelled backup loading!`)
          .setFooter(message.guild.name, guildicon2);

        return message.channel.send(timeIsUpEmbed);
      });

      let loadingStartingEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`${yes} | Starting loading the backup!`)
        .setFooter(message.guild.name, guildicon2);

      message.channel.send(loadingStartingEmbed);

      client.channels.cache.get(botlog).send(`** LOADING NEW BACKUP **\nBackup ID: ||Private||\nBackup Author: ${message.author.username}\nBackup Size: ${backupID.size}\nGuild: ${message.guild.name}`);

      backup.load(backupID, message.guild).catch((err) => {
        let permissionErrorEmbed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`${no} | Sorry, an error occurred... Please check that I have administrator permissions!`)
          .setFooter(message.guild.name, guildicon2);

        client.channels.cache.get(botlog).send(`** BACKUP FAILED TO LOAD **\nBackup ID: ${backupID} \nBackup Author: ${message.author.username}\nBackup Size: ${backupID.size}\nGuild: ${message.guild.name}`);

        return message.author.send(permissionErrorEmbed);
      });
    } catch (err) {
      console.log(err);
      let noBackupFoundEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`${no} No backup found for ${backupID}!`)
        .setFooter(message.guild.name, guildicon2);

      return message.channel.send(noBackupFoundEmbed);
    }
  },
};
