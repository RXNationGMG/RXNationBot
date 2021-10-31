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
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**<a:deny:892076004183506954> You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

        try {
            let a = db.fetch(`muterole_${message.guild.id}`)

            if (!a) {
                return message.channel.send("**<a:deny:892076004183506954> There Is No Muterole Set To Disable!**")
            } else {
                let role = message.guild.roles.cache.get(a)
                db.delete(`muterole_${message.guild.id}`)

                message.channel.send(`**<a:check:892071687250673664> \`${role.name}\` Has Been Successfully Disabled**`)
            }
            return;
        } catch {
            return message.channel.send("**<a:deny:892076004183506954> Error - `Missing Permissions or Role Doesn't Exist`**")
        }
    }
}