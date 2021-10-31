const db = require('quick.db');

module.exports = {
    config: {
        name: 'setxp',
        aliases: ['enablexp'],
        category: 'moderation',
        description: 'Enables Server XP Messages',
        usage: ' ',
        accessableby: 'Administrators'
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**<a:deny:892076004183506954> You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

        try {
            let a = await db.fetch(`guildMessages_${message.guild.id}`)

            if (a) {
                return message.channel.send("**<a:deny:892076004183506954> XP Messages Are Already Enabled In The Server!**")
            } else {
                db.set(`guildMessages_${message.guild.id}`, 1)

                message.channel.send("**<a:check:892071687250673664> XP Messages Are Enabled Successfully!**")
            }
            return;
        } catch (e) {
            console.log(e)
            return message.channel.send("**<a:deny:892076004183506954> Something Went Wrong!**")
        }
    }
}