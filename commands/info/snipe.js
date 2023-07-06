const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
    config: {
        name: "snipe",
        description: "Snipe last deleted command",
        usage: " ",
        category: "info",
        accessableby: "everyone",
        aliases: []
    },
    run: async (bot, message, args) => {
        let prefix = await db.fetch(`prefix_${message.guild.id}`);
        if (prefix == null) {
            prefix = config.DEFAULT_PREFIX; // Make sure to define the `DEFAULT_PREFIX` in the config file
        }

        const msg = bot.snipes.get(message.channel.id);
        if (!msg) return message.channel.send("<a:warn:891035320030724196> | There are no deleted messages");

        const { author, content, image } = msg;

        const embed = new MessageEmbed()
            .setAuthor(author, author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Deleted Message:** ${content}`)
            .setColor("RANDOM")
            .setTimestamp();

        if (image) {
            embed.setImage(image);
        }

        message.channel.send(embed);
    }
};
