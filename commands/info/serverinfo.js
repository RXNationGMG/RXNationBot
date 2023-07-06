const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "serverinfo",
        description: "Pulls the server info of the guild!",
        usage: " ",
        category: "info",
        accessableby: "everyone",
        aliases: ["sinfo"]
    },
    run: async (bot, message, args) => {
        try {
            const { guild } = message;

            const online = guild.members.cache.filter(m => m.presence.status === 'online').size;
            const idle = guild.members.cache.filter(m => m.presence.status === 'idle').size;
            const offline = guild.members.cache.filter(m => m.presence.status === 'offline').size;
            const dnd = guild.members.cache.filter(m => m.presence.status === 'dnd').size;
            const textChannels = guild.channels.cache.reduce((count, channel) => count + (channel.type === 'text' ? 1 : 0), 0);
            const voiceChannels = guild.channels.cache.reduce((count, channel) => count + (channel.type === 'voice' ? 1 : 0), 0);
            const roles = guild.roles.cache.size;

            const owner = (await guild.members.fetch(guild.ownerID)).user.tag;

            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Server Info")
                .setThumbnail(guild.iconURL())
                .setAuthor(`${guild.name} Info`, guild.iconURL())
                .addField(":crown: Guild Owner", owner, false)
                .addField(":id: Server ID", guild.id)
                .addField(":calendar: Created At", guild.createdAt.toLocaleString(), false)
                .addField(`:speech_balloon: Channels (${guild.channels.cache.size})`, `**${textChannels}** Text\n**${voiceChannels}** Voice`, false)
                .addField(`:busts_in_silhouette: Members (${guild.memberCount})`, `**${online}** Online\n**${idle}** Idle\n**${dnd}** Dnd\n> **${offline}** Offline\n**${guild.premiumSubscriptionCount}** Boosts`, false)
                .addField(`Roles (${roles})`, "To view all roles use the command **serverroles**", false)
                .setTimestamp()
                .setFooter(`Requested by: ${message.author.username}`, message.author.avatarURL());

            message.channel.send(embed);
        } catch (error) {
            console.error(error);
            message.channel.send('<a:deny:892076004183506954> | Something went wrong while retrieving server information!');
        }
    }
};
