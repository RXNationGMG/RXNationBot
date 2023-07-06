const { MessageEmbed } = require('discord.js');
const Random = require("srod-v2");

module.exports = {
  config: {
    name: 'minecraftachievement',
    category: 'image',
    aliases: ['mcachievement'],
    description: 'Provide a text and I will return a Minecraft achievement!',
    usage: "[text]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    if (!args[0]) {
      return message.channel.send("<a:deny:892076004183506954> | Please Give Achievement Text!");
    }

    try {
      const MinecraftAchievementEmbed = await Random.MinecraftAchievement(args.join(" "));
      return message.channel.send(MinecraftAchievementEmbed);
    } catch (error) {
      console.error(error);
      return message.channel.send("<a:deny:892076004183506954> | An error occurred while generating the Minecraft achievement!");
    }
  }
};
