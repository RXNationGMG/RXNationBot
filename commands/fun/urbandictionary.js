const urban = require('relevant-urban');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "urbandictionary",
    aliases: ["ud", "urban"],
    category: "fun",
    description: "Give information about urban words!",
    usage: "[word]",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please Enter Something To Search**");
    }
    
    const image = "http://cdn.marketplaceimages.windowsphone.com/v8/images/5c942bfe-6c90-45b0-8cd7-1f2129c6e319?imageType=ws_icon_medium";
    
    try {
      const res = await urban(args.join(' '));
      
      if (!res) {
        return message.channel.send("<a:deny:892076004183506954> | No results found for this topic, sorry!");
      }
      
      const { word, urbanURL, definition, example, thumbsUp, thumbsDown, author } = res;
      
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`Word - ${word}`)
        .setThumbnail(image)
        .setDescription(`**Definition:**\n*${definition || "No definition"}*\n\n**Example:**\n*${example || "No Example"}*`)
        .addField('**Rating:**', `**\`Upvotes: ${thumbsUp} | Downvotes: ${thumbsDown}\`**`)
        .addField("**Link**", `[link to ${word}](${urbanURL})`)
        .addField("**Author:**", `${author || "unknown"}`)
        .setTimestamp();
        
      message.channel.send(embed);
    } catch (e) {
      console.error(e);
      return message.channel.send("<a:deny:892076004183506954> | Something went wrong! Please try again later.");
    }
  }
};
