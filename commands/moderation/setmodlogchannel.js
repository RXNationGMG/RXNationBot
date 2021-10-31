const db = require("quick.db")

module.exports = {
    config: {
        name: "setmodlogchannel",
        category: "moderation",
        aliases: ['setm', 'sm', 'smc'],
        description: "Sets A Channel Where The Bot Can Send Moderation Logs!",
        usage: "[channel mention | channel ID | channel name]",
        accessableby: "Administrators"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**<a:deny:892076004183506954> You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")
    if (!args[0]) {
      let b = await db.fetch(`modlog_${message.guild.id}`);
      let channelName = message.guild.channels.cache.get(b);
      if (message.guild.channels.cache.has(b)) {
        return message.channel.send(
          `**<a:check:892071687250673664> Modlog Channel Set In This Server Is \`${channelName.name}\`!**`
        );
      } else
        return message.channel.send(
          "**<a:deny:892076004183506954> Please Enter A Channel Name or ID To Set!**"
        );
    }
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'text') return message.channel.send("**<a:deny:892076004183506954> Please Enter A Valid Text Channel!**");

        try {
            let a = await db.fetch(`modlog_${message.guild.id}`)

            if (channel.id === a) {
                return message.channel.send("**<a:deny:892076004183506954> This Channel is Already Set As Modlog Channel!**")
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send("**<a:check:892071687250673664> Modlog Channel Set!**")
                db.set(`modlog_${message.guild.id}`, channel.id)

                message.channel.send(`**<a:check:892071687250673664> Modlog Channel Has Been Set Successfully in \`${channel.name}\`!**`)
            }
        } catch {
            return message.channel.send("**<a:deny:892076004183506954> Error - `Missing Permissions Or Channel Is Not A Text Channel!`**");
        }
    }
};