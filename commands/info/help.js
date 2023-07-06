const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const db = require('quick.db');
const { stripIndents } = require("common-tags");
const { PREFIX } = require('../../config.js');

module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    usage: "[command name] (optional)",
    category: "info",
    description: "Displays all commands that the bot has.",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (prefix === null) {
      prefix = PREFIX;
    }

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
      .setThumbnail(bot.user.displayAvatarURL());

    if (!args[0]) {
      const categories = readdirSync("./commands/");

      embed.setDescription(`**These Are the Available Commands For ${message.guild.me.displayName}**\nRXNationBot's Global Prefix Is \`${PREFIX}\`\nServer Prefix Is \`${prefix}\`\n\nFor Help Related To A Particular Command Type -\n\`${prefix}help [command name]\` or \`${prefix}help [alias]\``);
      embed.setFooter(`${message.guild.me.displayName} | Total Commands - ${bot.commands.size - 1} Loaded`, bot.user.displayAvatarURL());

      categories.forEach(category => {
        const dir = bot.commands.filter(c => c.config.category === category);
        const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
        try {
          if (dir.size > 0) { // Check if there are commands in the category
            embed.addField(` ${capitalise} [${dir.size}] - `, dir.map(c => `\`${c.config.name}\``).join(", "));
          }
        } catch (e) {
          console.log(e);
        }
      });

      return message.channel.send(embed);
    } else {
      let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());
      if (!command) {
        return message.channel.send(embed.setTitle("**Invalid Command!**").setDescription(`**Do \`${prefix}help\` For the List Of the Commands!**`));
      }
      command = command.config;

      embed.setDescription(stripIndents`**RXNationBot's Global Prefix Is \`${PREFIX}\`**\n
            **Server Prefix Is \`${prefix}\`**\n
            ** Command -** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\n
            ** Description -** ${command.description || "No Description provided."}\n
            **Category -** ${command.category}\n
            ** Usage -** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}\n
            ** Accessible by -** ${command.accessableby || "everyone"}\n
            ** Aliases -** ${command.aliases ? command.aliases.join(", ") : "None."}`);
      embed.setFooter(message.guild.name, message.guild.iconURL());

      return message.channel.send(embed);
    }
  }
};
