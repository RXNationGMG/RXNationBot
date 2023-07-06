const db = require("quick.db");

module.exports = {
  config: {
    name: "setmuterole",
    category: "moderation",
    aliases: ["setmute", "smrole", "smr"],
    description: "Sets a mute role for muted users!",
    usage: "[role name | role mention | role ID]",
    accessableby: "Administrators",
  },
  run: async (bot, message, args) => {
    try {
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("**<a:deny:892076004183506954> | You do not have the required permissions! - [ADMINISTRATOR]**");
      }

      if (!args[0]) {
        const muteRoleId = await db.fetch(`muterole_${message.guild.id}`);
        const role = message.guild.roles.cache.get(muteRoleId);

        if (role) {
          return message.channel.send(`**<a:check:892071687250673664> | Mute role set in this server is \`${role.name}\`!**`);
        } else {
          return message.channel.send("**<a:deny:892076004183506954> | Please enter a role name or ID to set!**");
        }
      }

      const role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[0]) ||
        message.guild.roles.cache.find(c => c.name.toLowerCase() === args.join(" ").toLowerCase());

      if (!role) {
        return message.channel.send("**<a:deny:892076004183506954> | Please enter a valid role name or ID!**");
      }

      const muteRoleId = await db.fetch(`muterole_${message.guild.id}`);

      if (role.id === muteRoleId) {
        return message.channel.send("**<a:deny:892076004183506954> | This role is already set as the mute role!**");
      } else {
        db.set(`muterole_${message.guild.id}`, role.id);
        return message.channel.send(`**<a:check:892071687250673664> | \`${role.name}\` has been set successfully as the mute role!**`);
      }
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Error - `Missing permissions or role doesn't exist!`**");
    }
  },
};
