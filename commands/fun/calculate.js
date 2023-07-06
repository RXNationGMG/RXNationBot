const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
  config: {
    name: "calculate",
    aliases: ['calc', 'calculator'],
    description: "Shows Calculated Answers Of User's Query",
    usage: "[query](mathematical)",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      if (!args[0]) {
        return message.channel.send("**<a:deny:892076004183506954> | Enter Something To Calculate**");
      }

      const query = args.join(" ")
        .replace(/[x]/gi, "*")
        .replace(/[,]/g, ".")
        .replace(/[÷]/gi, "/");

      let result;
      try {
        result = math.evaluate(query);
      } catch (e) {
        return message.channel.send("**<a:deny:892076004183506954> | Enter Valid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**");
      }

      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`${bot.user.username} Calculator`, message.author.displayAvatarURL({ dynamic: true }))
        .addField("**Operation**", "```Js\n" + query + "```")
        .addField("**Result**", "```Js\n" + result + "```")
        .setFooter(message.guild.name, message.guild.iconURL());

      message.channel.send(embed);
    } catch (error) {
      console.error('✖️ An error occurred');
      console.error(error);
      message.channel.send('<a:deny:892076004183506954> | An error occurred while performing the calculation.');
    }
  }
};
