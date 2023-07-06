const { MessageEmbed } = require('discord.js');
const { GENIUS_API_KEY } = require('../../config.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = {
  config: {
    name: "lyrics",
    aliases: ["l"],
    category: "music",
    description: "Shows lyrics of the song being played",
    usage: "",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send("<a:deny:892076004183506954> | I'm sorry, but you need to be in a voice channel to see lyrics!");
    }
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("**<a:deny:892076004183506954> | You have to be in the same channel as the bot!**");
    }
    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send("<a:warn:891035320030724196> | **Nothing is playing in this server**");
    }

    const songName = serverQueue.songs[0].title.replace(/lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi, "");

    const sentMessage = await message.channel.send("<a:backup:892076096084901919> | Searching for lyrics, please wait...");

    try {
      const url = `https://api.genius.com/search?q=${encodeURIComponent(songName)}`;

      const headers = {
        Authorization: `Bearer ${GENIUS_API_KEY}`
      };

      const response = await fetch(url, { headers });
      const result = await response.json();
      const songID = result.response.hits[0]?.result?.id;
      if (!songID) {
        return message.channel.send("<a:deny:892076004183506954> | Lyrics is not available at this moment.");
      }

      const songUrl = `https://api.genius.com/songs/${songID}`;
      const songResponse = await fetch(songUrl, { headers });
      const songResult = await songResponse.json();
      const song = songResult.response.song;

      let lyrics = await getLyrics(song.url);
      lyrics = lyrics.replace(/(\[.+\])/g, '');

      const lyricsChunks = chunkString(lyrics, 2048);
      if (lyricsChunks.length === 0) {
        return sentMessage.edit("**<a:deny:892076004183506954> | Lyrics not available at this moment.**");
      }

      for (let i = 0; i < lyricsChunks.length; i++) {
        const lyricsEmbed = new MessageEmbed()
          .setColor('RANDOM')
          .setDescription(lyricsChunks[i].trim());
        
        if (i === 0) {
          await sentMessage.edit("", lyricsEmbed);
        } else {
          message.channel.send("", lyricsEmbed);
        }
      }
    } catch (error) {
      console.error(error);
      return sentMessage.edit("**<a:deny:892076004183506954> | Lyrics not available for this moment.**");
    }

    async function getLyrics(url) {
      const response = await fetch(url);
      const text = await response.text();
      const $ = cheerio.load(text);
      return $('.lyrics').text().trim();
    }

    function chunkString(str, size) {
      const regex = new RegExp(`.{1,${size}}`, 'g');
      return str.match(regex) || [];
    }
  }
};
