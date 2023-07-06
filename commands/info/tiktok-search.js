const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "tiktok-search",
    noalias: "",
    category: "info",
    description: "Shows TikTok account statistics",
    usage: "[username]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    // Display maintenance message
    const maintenanceEmbed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("Command Maintenance")
      .setDescription("The `tiktok-search` command is currently under maintenance. Please try again later.")
      .setFooter("We apologize for any inconvenience caused.");

    message.channel.send(maintenanceEmbed);
  }
};
