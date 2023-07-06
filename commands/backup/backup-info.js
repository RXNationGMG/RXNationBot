const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");
const yaml = require("js-yaml");
const backup = require("discord-backup");

const { attention, no, arrowhere } = yaml.load(fs.readFileSync("./config.yml"));

module.exports = {
  config: {
    name: "backup-info",
    description: "Show a list of your guild's backups",
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
        .setDescription(`${no} | You must specify a valid backup ID ${no}`)
        .setFooter(message.author.username, message.author.displayAvatarURL());

      return message.channel.send(notValidEmbed);
    }

    try {
      const backupInfos = await backup.fetch(backupID);
      const date = new Date(backupInfos.data.createdTimestamp);
      const yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(),
        dd = date.getDate().toString();
      const formattedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`;

      let backups = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(
          `** BACKUP INFO **\n ${arrowhere} | Backup ID: ${backupInfos.id} \n ${arrowhere} | Server ID: ${backupInfos.data.guildID} \n ${arrowhere} | Backup Size: ${backupInfos.size} mb \n ${arrowhere} | Backup Created At: ${formattedDate}`
        )
        .setFooter(`${attention} Aerv`, client.user.displayAvatarURL());

      message.channel.send(backups);
    } catch (err) {
      let noBackupFoundEmbed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setDescription(`No Backup Found For ${backupID} ${attention}`)
        .setFooter(message.author.username, message.author.displayAvatarURL());

      return message.channel.send(noBackupFoundEmbed);
    }
  },
};
