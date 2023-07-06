const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "rolememberinfo",
        aliases: ['rolemembers', 'rmi'],
        category: "info",
        description: "Shows list of members having a role",
        usage: "[role name | role mention | ID]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        try {
            if (args.includes("@everyone")) return;
            if (args.includes("@here")) return;

            if (!args[0]) return message.channel.send("**<a:deny:892076004183506954> | Please Enter A Role!**");

            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());
            if (!role) return message.channel.send("**<a:deny:892076004183506954> | Please Enter A Valid Role!**");

            const membersWithRole = role.members.size;
            const memberList = role.members.map(member => member.user.tag);

            let roleEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(message.guild.iconURL())
                .setTitle(`Users With The ${role.name} Role!`);

            if (membersWithRole > 0) {
                const chunkSize = 2048;
                const memberChunks = memberList.join("\n").match(new RegExp(`.{1,${chunkSize}}`, "g"));
                memberChunks.forEach(chunk => {
                    roleEmbed.setDescription(chunk);
                    message.channel.send(roleEmbed);
                });
            } else {
                roleEmbed.setDescription("<a:deny:892076004183506954> | No members have this role.");
                message.channel.send(roleEmbed);
            }
        } catch (error) {
            console.error(error);
            message.channel.send("<a:deny:892076004183506954> | An error occurred while retrieving role member information.");
        }
    }
}
