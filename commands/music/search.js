const { MessageEmbed, Util } = require("discord.js");
const { GOOGLE_API_KEY } = require('../../config.js');
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

module.exports = {
  config: {
    name: "search",
    category: "music",
    noalias: [''],
    description: "Searches music from YouTube",
    usage: " ",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a song name!**");
    }
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const searchString = args.slice(1).join(' ');

    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send("**<a:deny:892076004183506954> | You are not in a voice channel!**");
    }

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
      return message.channel.send('<a:deny:892076004183506954> | I cannot connect to your voice channel. Please make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
      return message.channel.send('<a:deny:892076004183506954> | I cannot speak in this voice channel. Please make sure I have the proper permissions!');
    }

    try {
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();

        for (const video of videos) {
          const video2 = await youtube.getVideoByID(video.id);
          await handleVideo(video2, message, channel, true);
        }
      } else {
        let video;
        if (url) {
          video = await youtube.getVideo(url);
          console.log(video);
        } else {
          const videos = await youtube.searchVideos(searchString, 10);
          if (videos.length === 0) {
            return message.channel.send('<a:deny:892076004183506954> | I could not obtain any search results.');
          }
          let index = 0;
          const sembed = new MessageEmbed()
            .setColor("RANDOM")
            .setFooter(message.member.displayName, message.author.avatarURL())
            .setDescription(`
            __**Song selection:**__\n
            ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
            \nPlease provide a value to select one of the search results ranging from 1-10.
            `)
            .setTimestamp();
          message.channel.send(sembed).then(message2 => message2.delete({ timeout: 10000 }));

          try {
            const response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
              max: 1,
              time: 10000,
              errors: ['time']
            });
            const videoIndex = parseInt(response.first().content);
            video = await youtube.getVideoByID(videos[videoIndex - 1].id);
          } catch (err) {
            console.log(err);
            return message.channel.send('<a:deny:892076004183506954> | **Timeout!**');
          }
        }
        return handleVideo(video, message, channel);
      }
    } catch (error) {
      console.error(error);
      return message.channel.send('<a:deny:892076004183506954> | Something went wrong while searching for the video.');
    }

    async function handleVideo(video, message, channel, playlist = false) {
      const serverQueue = ops.queue.get(message.guild.id);
      const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      };

      if (!serverQueue) {
        const queueConstruct = {
          textChannel: message.channel,
          voiceChannel: channel,
          connection: null,
          songs: [],
          volume: 7,
          playing: true,
          loop: false
        };
        ops.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
          const connection = await channel.join();
          queueConstruct.connection = connection;
          play(message.guild, queueConstruct.songs[0], message);
        } catch (error) {
          console.error(`<a:deny:892076004183506954> | I could not join the voice channel: ${error}`);
          ops.queue.delete(message.guild.id);
          return undefined;
        }
      } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) {
          return undefined;
        } else {
          const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Added To The Queue")
            .setThumbnail(song.thumbnail)
            .setTimestamp()
            .setDescription(`**${song.title}** has been added to the queue!`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL());
          message.channel.send(embed);
        }
      }
      return undefined;
    }

    async function play(guild, song, msg) {
      const serverQueue = ops.queue.get(guild.id);

      if (!song) {
        serverQueue.voiceChannel.leave();
        ops.queue.delete(guild.id);
        return;
      }

      const dispatcher = serverQueue.connection.play(await ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 20, quality: "highestaudio" }))
        .on('finish', () => {
          if (serverQueue.loop) {
            serverQueue.songs.push(serverQueue.songs.shift());
            return play(guild, serverQueue.songs[0], msg);
          }
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0], msg);
        })
        .on('error', error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle('🎧 Now Playing\n')
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setDescription(`Now playing:\n **${song.title}**`)
        .setFooter(msg.member.displayName, msg.author.displayAvatarURL());
      serverQueue.textChannel.send(embed);
    }
  }
};
