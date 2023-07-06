const { MessageEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
  config: {
    name: "meme",
    category: "fun",
    aliases: ["gimmememe"],
    description: "Sends an epic meme!",
    usage: "",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    const subReddits = [
      "dankmemes",
      "memes",
      "me_irl",
      "AdviceAnimals",
      "MemeEconomy",
      "ComedyCemetery",
      "PrequelMemes",
      "terriblefacebookmemes",
      "PewdiepieSubmissions"
    ];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    try {
      const { body } = await snekfetch
        .get(`https://www.reddit.com/r/${random}/random.json`)
        .query({ limit: 1 });

      const [post] = body;
      const { title, permalink } = post.data.children[0].data;
      const image = post.data.children[0].data.url;

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(title)
        .setURL(`https://www.reddit.com${permalink}`)
        .setImage(image);

      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      message.channel.send("<a:warn:891035320030724196> | Sorry, an error occurred while fetching the meme.");
    }
  }
};
