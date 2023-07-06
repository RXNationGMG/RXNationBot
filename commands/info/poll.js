const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "poll",
    description: "Create a poll",
    category: "info",
    usage: "[question]",
    noalias: "No Aliases",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.channel.send("**<a:deny:892076004183506954> | You do not have sufficient permissions to use this command!**");
    }

    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a question for the poll!**");
    }

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Poll for ${message.guild.name}`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL())
      .setDescription(args.join(' '));
    const msg = await message.channel.send(embed);

    await msg.react('✅');
    await msg.react('❌');

    message.delete({ timeout: 1000 });
  }
};
