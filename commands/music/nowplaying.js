const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'nowplaying',
    category: 'music',
    aliases: ['np'],
    description: 'Now playing command',
    usage: 'Shows current song playing',
    accessableby: 'everyone',
  },
  run: async (bot, message, args, ops) => {
    try {
      const { channel } = message.member.voice;
      if (!channel) {
        return message.channel.send(
          '<a:deny:892076004183506954> | I\'m sorry but you need to be in a voice channel to see the current song playing!'
        );
      }
      if (message.guild.me.voice.channel !== channel) {
        return message.channel.send(
          '**<a:deny:892076004183506954> | You Have To Be In The Same Channel With The Bot!**'
        );
      }
      const serverQueue = ops.queue.get(message.guild.id);
      if (!serverQueue) {
        return message.channel.send(
          '<a:warn:891035320030724196> | **Nothing playing in this server**'
        );
      }
      const video = serverQueue.songs[0];
      const description = video.duration === 'Live Stream' ? 'Live Stream' : playbackBar(serverQueue.connection.dispatcher.streamTime, video.duration);

      const videoEmbed = new MessageEmbed()
        .setThumbnail(video.thumbnail)
        .setColor('RANDOM')
        .setTitle(video.title)
        .setDescription(description)
        .setFooter(message.member.displayName, message.author.displayAvatarURL())
        .setTimestamp();
        
      message.channel.send(videoEmbed);
    } catch (error) {
      console.error(error);
      message.channel.send('**<a:deny:892076004183506954> | Something Went Wrong!**');
    }
  },
};

function playbackBar(passedTimeInMS, totalDurationObj) {
  const passedTimeInMSObj = {
    seconds: Math.floor((passedTimeInMS / 1000) % 60),
    minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
    hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24),
  };

  const passedTimeFormatted = formatDuration(passedTimeInMSObj);
  const totalDurationFormatted = formatDuration(totalDurationObj);

  const totalDurationInMS = Object.values(totalDurationObj).reduce(
    (total, value, index) =>
      total + value * (index === 0 ? 3600000 : index === 1 ? 60000 : 100),
    0
  );

  const playBackBarLocation = Math.round(
    (passedTimeInMS / totalDurationInMS) * 10
  );

  let playBack = '';
  for (let i = 1; i < 21; i++) {
    if (playBackBarLocation === 0) {
      playBack = ':musical_note:▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
      break;
    } else if (playBackBarLocation === 11) {
      playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬:musical_note:';
      break;
    } else if (i === playBackBarLocation * 2) {
      playBack += ':musical_note:';
    } else {
      playBack += '▬';
    }
  }

  playBack = `${playBack}\n\n\`${passedTimeFormatted} / ${totalDurationFormatted}\``;
  return playBack;
}

function formatDuration(durationObj) {
  const hours = durationObj.hours ? `${durationObj.hours}:` : '';
  const minutes = durationObj.minutes ? durationObj.minutes : '00';
  const seconds = durationObj.seconds < 10 ? `0${durationObj.seconds}` : durationObj.seconds;

  return `${hours}${minutes}:${seconds}`;
}
