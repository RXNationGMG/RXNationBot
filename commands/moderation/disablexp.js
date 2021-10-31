const db = require('quick.db');

module.exports = {
    config: {
        name: 'disablexp',
        aliases: ['dxp'],
        category: 'moderation',
        description: 'Disables Server XP Messages',
        usage: ' ',
        accessableby: 'Administrators'
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**<a:deny:892076004183506954> You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

        try {
            let a  = await db.fetch(`guildMessages_${message.guild.id}`)

            if (!a) {
                return message.channel.send("**<a:warn:891035320030724196> XP Messages Are Already Disabled In The Server!**")
            } else {
                db.delete(`guildMessages_${message.guild.id}`)

                message.channel.send("**<a:check:892071687250673664> XP Messages Are Disabled Successfully!**")
            }
            return;
        } catch {
            return message.channel.send("**<a:deny:892076004183506954> Something Went Wrong!**")
        }
    }
}