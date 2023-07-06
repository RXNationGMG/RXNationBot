const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "user-info",
        aliases: ['user'],
        category: "info",
        description: "Shows user info",
        usage: "!user-info",
    },
    run: async (client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let status;
        switch (user.presence.status) {
            case "online":
                status = "Online";
                break;
            case "dnd":
                status = "Do Not Disturb";
                break;
            case "idle":
                status = "Idle";
                break;
            case "offline":
                status = "Offline";
                break;
        }

        const embed = new MessageEmbed()
            .setTitle(`${user.user.username} Stats`)
            .setColor("RANDOM")
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: "Name",
                    value: user.user.username,
                    inline: true
                },
                {
                    name: "Discriminator",
                    value: `#${user.user.discriminator}`,
                    inline: true
                },
                {
                    name: "ID",
                    value: user.user.id,
                },
                {
                    name: "Current Status",
                    value: status,
                    inline: true
                },
                {
                    name: "Activity",
                    value: user.presence.activities[0] ? user.presence.activities[0].name : "User isn't playing a game!",
                    inline: true
                },
                {
                    name: "Avatar Link",
                    value: `[Click Here](${user.user.displayAvatarURL()})`
                },
                {
                    name: "Creation Date",
                    value: user.user.createdAt.toLocaleDateString("en-US"),
                    inline: true
                },
                {
                    name: "Joined Date",
                    value: user.joinedAt.toLocaleDateString("en-US"),
                    inline: true
                },
                {
                    name: "User Roles",
                    value: user.roles.cache.map(role => role.toString()).join(", ") || "No roles",
                    inline: true
                }
            );

        await message.channel.send(embed);
    }
};
