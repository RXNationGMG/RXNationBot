const db = require('quick.db');

module.exports = {
  config: {
    name: 'disableverification',
    aliases: ['dv', 'disableverify'],
    category: 'moderation',
    description: "Disables Server Verification System",
    usage: ' ',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
    }

    let verifychannel = db.fetch(`verificationchannel_${message.guild.id}`);
    if (!verifychannel || !message.guild.channels.cache.has(verifychannel)) {
      return message.channel.send("**<a:deny:892076004183506954> | No verification system is set to be disabled!**");
    }

    let verifiedchannel = message.guild.channels.cache.get(verifychannel);
    if (!verifiedchannel) {
      db.delete(`verificationchannel_${message.guild.id}`);
      return message.channel.send("**<a:deny:892076004183506954> | The verification channel doesn't exist or has been deleted!**");
    }

    let verifyrole = db.fetch(`verificationrole_${message.guild.id}`);
    if (!verifyrole || !message.guild.roles.cache.has(verifyrole)) {
      return message.channel.send("**<a:deny:892076004183506954> | No verification role is set to be disabled!**");
    }

    let role = message.guild.roles.cache.get(verifyrole);
    if (!role) {
      db.delete(`verificationrole_${message.guild.id}`);
      return message.channel.send("**<a:deny:892076004183506954> | The verification role doesn't exist or has been deleted!**");
    }

    try {
      message.guild.channels.cache.forEach(channel => {
        if (channel.type === 'category' && channel.id === verifiedchannel.id) return;
        let permissionOverwrites = channel.permissionOverwrites.get(role.id);
        if (!permissionOverwrites) return;

        if (permissionOverwrites.deny.has("VIEW_CHANNEL") || permissionOverwrites.deny.has("SEND_MESSAGES")) return;

        channel.createOverwrite(message.guild.id, {
          VIEW_CHANNEL: true
        });

        channel.updateOverwrite(role, {
          VIEW_CHANNEL: null,
          SEND_MESSAGES: null
        });
      });

      verifiedchannel.updateOverwrite(role, {
        SEND_MESSAGES: null,
        VIEW_CHANNEL: null
      });

      verifiedchannel.delete();
      db.delete(`verificationchannel_${message.guild.id}`);
      db.delete(`verificationrole_${message.guild.id}`);

      return message.channel.send(`**<a:check:892071687250673664> | Successfully disabled the verification system in ${message.guild.name}!**`);
    } catch (error) {
      console.error(error);
      return message.channel.send('**<a:deny:892076004183506954> | Something went wrong while disabling the verification system!**');
    }
  }
};
