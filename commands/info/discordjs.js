const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "discordjs",
    aliases: ['docs'],
    category: "info",
    description: "Fast access to Discord.js documentation",
    usage: "<query>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    // Check if the command is in maintenance mode
    const maintenanceMode = true; // Set this to true during maintenance

    if (maintenanceMode) {
      return message.channel.send({
        embed: {
          color: 'RED',
          description: "⚠️ | This command is currently undergoing maintenance. Please try again later."
        }
      });
    }

    let version = args[1] || 'stable';

    try {
      const response = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${encodeURIComponent(version)}&q=${encodeURIComponent(search)}`);
      const body = await response.json();

      if (body === null || !body.fields || body.fields.length === 0) {
        const embed = new MessageEmbed()
          .setColor(0x4D5E94)
          .setAuthor("Discord.js Docs (master)", "https://discord.js.org/favicon.ico")
          .setTitle("Search results:")
          .setDescription("<a:deny:892076004183506954> | **No results found.**");

        return message.channel.send(embed);
      }

      body.color = 0x4D5E94;
      message.channel.send({ embed: body });
    } catch (error) {
      const embed = new MessageEmbed()
        .setColor(0x4D5E94)
        .setAuthor("Discord.js Docs (master)", "https://discord.js.org/favicon.ico")
        .setTitle("Search results:")
        .setDescription("No results found.");

      message.channel.send(embed);
    }
  }
};
