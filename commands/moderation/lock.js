const { MessageEmbed } = require("discord.js");
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: "lock",
    aliases: [],
    description: "Lock Channels",
    category: "moderation",
    usage: "",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return message.channel.send(
        new MessageEmbed()
          .setDescription("<a:deny:892076004183506954> | You don't have enough permissions to use this command.")
      );
    }

    const mentionedChannels = message.mentions.channels;
    if (mentionedChannels.size === 0) {
      return message.channel.send(
        new MessageEmbed()
          .setDescription("<a:deny:892076004183506954> | You didn't specify a channel to lock.")
      );
    }

    mentionedChannels.forEach(async (channel) => {
      if (!channel.permissionsFor(message.guild.id).has("SEND_MESSAGES")) {
        return message.channel.send("<a:deny:892076004183506954> | That channel is already locked.");
      }

      try {
        await channel.updateOverwrite(message.guild.id, {
          SEND_MESSAGES: false,
        });
        message.channel.send(`<a:check:892071687250673664> | <#${channel.id}> has been successfully locked. Type: **${PREFIX}unlock <#${channel.id}>** to unlock it!`);
      } catch (err) {
        console.log(err);
      }
    });
  },
};
