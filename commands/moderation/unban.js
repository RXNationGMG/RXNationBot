const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "unban",
    aliases: ['ub'],
    category: "moderation",
    description: "Unban members",
    usage: "[ !unban [user id] ]",
  },
  run: async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.channel.send(
        "<a:deny:892076004183506954> | You are unable to unban members"
      );
    }

    const memberId = args[0];

    if (!memberId) {
      return message.channel.send(
        "<a:deny:892076004183506954> | Please provide the user ID to unban. Usage: `!unban [user id]`"
      );
    }

    try {
      const bans = await message.guild.fetchBans();
      const bannedUser = bans.get(memberId);

      if (!bannedUser) {
        return message.channel.send(
          "<a:deny:892076004183506954> | The specified user is not banned in this server."
        );
      }

      await message.guild.members.unban(bannedUser);
      return message.channel.send(
        `<a:check:892071687250673664> | User with ID ${memberId} has been unbanned!`
      );
    } catch (e) {
      console.error(e);
      return message.channel.send(
        "<a:deny:892076004183506954> | An error occurred while unbanning the user."
      );
    }
  },
};
