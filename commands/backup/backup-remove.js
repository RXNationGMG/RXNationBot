const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");
const yaml = require("js-yaml");
const backup = require("discord-backup");

const { arrowhere, botlog, no } = yaml.load(fs.readFileSync("./config.yml"));
const { attention } = yaml.load(fs.readFileSync("./config.yml"));

module.exports = {
  config: {
    name: "backup-remove",
    description: "Remove backup.",
    accessableby: "Administrator",
    category: "backup",
    aliases: [],
    usage: "",
  },
  run: async (client, message, args) => {
    let backupID = args[0];
    if (!backupID) {
      let notValidEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription(`${no} You must specify a valid backup ID to remove ${no}`)
        .setFooter(message.author.username, message.author.displayAvatarURL());

      return message.channel.send(notValidEmbed);
    }

    try {
      const backupInfos = await backup.fetch(backupID);
      backup.remove(backupID);

      let backupDeletedEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`** BACKUP DELETED **`)
        .setFooter(client.user.username, client.user.displayAvatarURL());

      client.channels.cache.get(botlog).send(`** NEW BACKUP DELETED **\nAuthor: ${message.author.username}`);
      message.channel.send(backupDeletedEmbed);
    } catch (err) {
      let noBackupFoundEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription(`No backup found for ${backupID} ${attention}`)
        .setFooter(message.author.username, message.author.displayAvatarURL());

      return message.channel.send(noBackupFoundEmbed);
    }
  },
};
