const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "uptime",
        description: "Shows the uptime of the bot",
        aliases: ["up"],
        category: "info",
        usage: "",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        const uptime = formatUptime(bot.uptime);

        const embed = new MessageEmbed()
            .setTitle("Uptime")
            .setColor("RANDOM")
            .setDescription(uptime)
            .setThumbnail(bot.user.displayAvatarURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setAuthor(bot.user.username, bot.user.displayAvatarURL());

        message.channel.send(embed);
    }
};

function formatUptime(uptime) {
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
}
