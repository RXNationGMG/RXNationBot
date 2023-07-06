const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "unlock",
    aliases: [],
    description: "Unlock Channels",
    category: "moderation",
    usage: "<channelid>",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return message.channel.send(
        new MessageEmbed().setDescription(
          "<a:deny:892076004183506954> | You don't have enough permissions to use this command."
        )
      );
    }

    const channels = message.mentions.channels;
    if (!channels.size) {
      return message.channel.send(
        new MessageEmbed().setDescription(
          "<a:deny:892076004183506954> | You didn't specify any channels to unlock."
        )
      );
    }

    channels.forEach(async (channel) => {
      if (channel.permissionsFor(message.guild.id).has("SEND_MESSAGES")) {
        return message.channel.send(
          new MessageEmbed().setDescription(
            "<a:deny:892076004183506954> | That channel is already unlocked."
          )
        );
      }

      try {
        await channel.updateOverwrite(message.guild.id, {
          SEND_MESSAGES: true,
        });
        message.channel.send(
          new MessageEmbed().setDescription(
            `<a:check:892071687250673664> | <#${channel.id}> has been successfully unlocked.`
          )
        );
      } catch (err) {
        console.error(err);
      }
    });
  },
};
