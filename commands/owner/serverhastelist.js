const Discord = require("discord.js");
const ownerIds = ["725260858028195892"];
const hastebin = require('hastebin.js');
const haste = new hastebin();

module.exports = {
  config: {
    name: "serverhastelist",
    aliases: ["shastelist"],
    category: "owner",
    description: "Generates a hastebin link containing information about all servers the bot is in.",
    usage: " ",
    accessableby: "Owner"
  },
  run: async (bot, message, args) => {
    if (!ownerIds.includes(message.author.id)) {
      return;
    }

    const serverInfoArray = [];

    bot.guilds.cache.forEach((server) => {
      serverInfoArray.push(`
--> Server Info of ${server.name} <--

Server Name: ${server.name}
Member Count: ${server.memberCount}
Server ID: ${server.id}

---> Info of ${server.name} Ends Here <---
`);
    });

    console.log(serverInfoArray);

    haste.post(serverInfoArray)
      .then((link) => {
        const upload = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(`[Uploaded Server List](${link})`)
          .setFooter(message.guild.name, message.guild.iconURL());

        message.channel.send(upload);
      })
      .catch((error) => {
        console.error(error);
        message.channel.send("<a:deny:892076004183506954> | An error occurred while generating the server list.");
      });
  }
};
