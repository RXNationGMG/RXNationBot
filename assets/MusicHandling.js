const { MessageEmbed, Util } = require('discord.js');
const ytdl = require('ytdl-core');

const handleVideo = async (video, message, voiceChannel, playlist = false) => {
  const queue = message.client.playlists;
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`,
    channel: video.channel.title,
    channelurl: `https://www.youtube.com/channel/${video.channel.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    thumbnail: video.thumbnails.default.url,
    author: message.author.username,
  };

  if (!queue.has(message.guild.id)) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 7,
      playing: true,
      loop: false,
    };
    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      queue.delete(message.guild.id);
      const embed = new MessageEmbed()
        .setAuthor('Error')
        .setDescription(`An error has occurred: ${error}`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
  } else {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue.songs.length >= message.settings.maxqueuelength) {
      return message.client.embed('maxQueue', message);
    }
    serverQueue.songs.push(song);
    if (!playlist) {
      const embed = new MessageEmbed()
        .setAuthor('Song added!')
        .setDescription(`<a:check:892071687250673664> **${song.title}** has been added to the queue!`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
  }
};

function play(guild, song) {
  const queue = guild.client.playlists;
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url, { quality: 'lowest', filter: 'audioonly' }), { passes: 3, volume: guild.voiceConnection?.volume || 0.2 })
    .on('end', () => {
      if (!serverQueue.loop) {
        serverQueue.songs.shift();
        setTimeout(() => {
          play(guild, serverQueue.songs[0]);
        }, 250);
      } else {
        setTimeout(() => {
          play(guild, serverQueue.songs[0]);
        }, 250);
      }
    });

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  const songdurm = String(song.durationm).padStart(2, '0');
  const songdurh = String(song.durationh).padStart(2, '0');
  const songdurs = String(song.durations).padStart(2, '0');

  const embed = new MessageEmbed()
    .setTitle(song.channel)
    .setURL(song.channelurl)
    .setThumbnail(song.thumbnail)
    .setDescription(`[${song.title}](${song.url})`)
    .addField('__Duration__', `${songdurh}:${songdurm}:${songdurs}`, true)
    .addField('__Requested by__', song.author, true)
    .setColor(guild.member(guild.client.user.id).roles.highest.color || 0x00AE86);

  if (!serverQueue.loop) {
    return serverQueue.textChannel.send(embed);
  }
}
