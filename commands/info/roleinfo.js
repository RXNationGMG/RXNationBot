const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: 'roleinfo',
        category: "info",
        aliases: ["rinfo"],
        description: "Shows stats of the mentioned role",
        usage: "[role name | role mention | ID]",
        accessableby: 'everyone'
    },
    run: async (bot, message, args) => {
        try {
            if (!args[0]) return message.channel.send("**<a:deny:892076004183506954> | Please Enter A Role!**");

            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());
            if (!role) return message.channel.send("**<a:deny:892076004183506954> | Please Enter A Valid Role!**");

            const status = {
                false: "No",
                true: "Yes"
            };

            const roleMembers = role.members.size;
            const roleMentionable = status[role.mentionable];

            const roleEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor("Role Info")
                .setThumbnail(message.guild.iconURL())
                .addField("**ID**", `\`${role.id}\``, true)
                .addField("**Name**", role.name, true)
                .addField("**Hex**", role.hexColor)
                .addField("**Members**", roleMembers)
                .addField("**Position**", role.position)
                .addField("**Mentionable**", roleMentionable)
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setTimestamp();

            message.channel.send(roleEmbed);
        } catch (error) {
            console.error(error);
            message.channel.send("<a:deny:892076004183506954> | An error occurred while retrieving role information.");
        }
    }
}
