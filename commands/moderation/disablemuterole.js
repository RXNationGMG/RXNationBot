const db = require('quick.db');

module.exports = {
  config: {
    name: "disablemuterole",
    aliases: ['clearmuterole', 'dmr', 'disablemr', 'dmrole'],
    category: 'moderation',
    description: 'Disables Server Mute Role',
    usage: '[role name | role mention | role ID]',
    accessableby: 'Administrators'
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
    }

    try {
      let muteRoleId = db.fetch(`muterole_${message.guild.id}`);

      if (!muteRoleId) {
        return message.channel.send('**<a:deny:892076004183506954> | There is no mute role set to disable!**');
      }

      let role = message.guild.roles.cache.get(muteRoleId);
      if (!role) {
        db.delete(`muterole_${message.guild.id}`);
        return message.channel.send("**<a:deny:892076004183506954> | The mute role doesn't exist or has been deleted!**");
      }

      db.delete(`muterole_${message.guild.id}`);

      message.channel.send(`**<a:check:892071687250673664> | \`${role.name}\` has been successfully disabled**`);
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | An error occurred while disabling the mute role!**");
    }
  }
};
