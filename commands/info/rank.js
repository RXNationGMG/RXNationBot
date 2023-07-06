const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    config: {
        name: "rank",
        aliases: ['rank'],
        category: 'info',
        description: 'Shows User Profile',
        usage: '[mention | username | nickname | ID]',
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        try {
            const user = message.mentions.users.first() || message.author;
            const guildId = message.guild.id;
            const userId = user.id;

            const level = db.fetch(`level_${guildId}_${userId}`) || 0;
            const xp = db.fetch(`messages_${guildId}_${userId}`) || 0;

            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(user.tag, user.avatarURL())
                .setDescription(`Level: ${level}\nXP: ${xp}`);

            message.channel.send(embed);
        } catch (error) {
            console.error(error);
            message.channel.send("<a:deny:892076004183506954> | An error occurred while fetching user profile.");
        }
    }
}
