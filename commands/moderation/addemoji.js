const Discord = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
  config: {
    name: "addemoji",
    aliases: [],
    description: "Adds emoji to server",
    category: "moderation",
    usage: "<emojiname> <link>",
    accessableby: "Administrator",
  },
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_EMOJIS")) {
      return message.channel.send(
        "<a:deny:892076004183506954> | You don't have permission to use this command! Manage Emojis"
      );
    }

    const emoji = args[0];
    if (!emoji) {
      return message.channel.send("<a:deny:892076004183506954> | Please give me an emoji!");
    }

    let customemoji = Discord.Util.parseEmoji(emoji);

    if (customemoji.id) {
      const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${customemoji.animated ? "gif" : "png"}`;
      const name = args.slice(1).join(" ");

      try {
        const createdEmoji = await message.guild.emojis.create(Link, name || customemoji.name);
        const Added = new Discord.MessageEmbed()
          .setTitle("Emoji Added")
          .setColor("RANDOM")
          .setDescription(
            `Emoji has been added! | Name: ${name || customemoji.name} | Preview: [Click Me](${createdEmoji.url})`
          );
        return message.channel.send(Added);
      } catch (error) {
        console.error(error);
        return message.channel.send("<a:deny:892076004183506954> | An error occurred while adding the emoji.");
      }
    } else {
      let CheckEmoji = parse(emoji, { assetType: "png" });
      if (!CheckEmoji[0]) {
        return message.channel.send("<a:deny:892076004183506954> | Please give me a valid emoji!");
      }
      return message.channel.send("<a:warn:891035320030724196> | You can use normal emojis without adding them to the server!");
    }
  },
};
