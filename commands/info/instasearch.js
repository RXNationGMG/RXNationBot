const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "instasearch",
    aliases: ["searchinsta", "sinsta"],
    category: "info",
    description: "Find out some nice Instagram statistics (BETA)",
    usage: "[instagram username]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    // Display maintenance message
    const maintenanceEmbed = new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("Command Maintenance")
      .setDescription("The `instasearch` command is currently under maintenance. Please try again later.")
      .setFooter("We apologize for any inconvenience caused.");

    message.channel.send(maintenanceEmbed);
  }
};
