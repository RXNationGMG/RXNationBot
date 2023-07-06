const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { PREFIX } = require('../../config.js');
const musictriviajson = require('../../JSON/musictrivia.json');
const db = require('quick.db');

module.exports = {
  config: {
    name: 'musictrivia',
    category: 'music',
    aliases: ['musicquiz', 'mt'],
    description: "Music Trivia for You",
    usage: "[amount of songs]",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    let prefix = PREFIX;
    const fetched = await db.fetch(`prefix_${message.guild.id}`);
    if (fetched !== null) {
      prefix = fetched;
    }

    const noPermEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription("**<a:deny:892076004183506954> | You do not have permissions to add money!**");

    if (!message.member.hasPermission("CONNECT") || !message.member.hasPermission("SPEAK")) {
      return message.channel.send(noPermEmbed);
    }

    const serverQueue = ops.queue.get(message.guild.id);
    if (serverQueue) {
      return message.channel.send("<a:deny:892076004183506954> | Cannot Play Music Trivia While Music is Playing!");
    }

    const triviaData = {
      isTriviaRunning: false,
      wasTriviaEndCalled: false,
      triviaQueue: [],
      triviaScore: new Map()
    };
    ops.queue2.set(message.guild.id, triviaData);

    const { channel } = message.member.voice;
    const channelJoinEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription("**<a:deny:892076004183506954> | Please Join A VC To Play Music Trivia!**");

    if (!channel) {
      return message.channel.send(channelJoinEmbed);
    }

    if (serverQueue && serverQueue.playing) {
      return message.channel.send('**<a:warn:891035320030724196> | A quiz or a song is already running!**');
    }

    triviaData.isTriviaRunning = true;

    if (!args[0]) {
      return message.channel.send("**<a:warn:891035320030724196> | What is the number of songs you want the quiz to have?**");
    }

    const numSongs = parseInt(args[0]);

    if (numSongs >= 5 && numSongs <= 15) {
      const videoDataArray = musictriviajson.songs;
      const randomXVideoLinks = getRandom(videoDataArray, numSongs);

      const infoEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Starting Music Quiz')
        .setDescription(`Get ready! There are ${numSongs} songs, you have 30 seconds to guess either the singer/band or the name of the song. Good luck!\nYou can end the trivia at any point by using the end-trivia command`);
      
      message.channel.send(infoEmbed);

      randomXVideoLinks.forEach(video => {
        const song = {
          url: video.url,
          singer: video.singer,
          title: video.title,
          voiceChannel: channel
        };
        triviaData.triviaQueue.push(song);
      });

      const channelInfo = Array.from(message.member.voice.channel.members.entries());
      channelInfo.forEach(user => {
        if (!user[1].user.bot) {
          triviaData.triviaScore.set(user[1].user.username, 0);
        }
      });

      playQuizSong(triviaData.triviaQueue, message);
    } else {
      return message.channel.send("**<a:deny:892076004183506954> | Please enter a number between 5 and 15**");
    }

    async function playQuizSong(queue, message) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 7,
        playing: true,
        loop: false
      };
      ops.queue3.set(message.guild.id, queueConstruct);

      try {
        const connection = await queue[0].voiceChannel.join();
        queueConstruct.connection = connection;

        const dispatcher = connection.play(ytdl(queue[0].url, { quality: 'highestaudio', highWaterMark: 1 << 20 }));

        dispatcher.on('start', () => {
          dispatcher.setVolume(queueConstruct.volume);
          let songNameFound = false;
          let songSingerFound = false;

          const filter = m => triviaData.triviaScore.has(m.author.username);
          const collector = message.channel.createMessageCollector(filter, { time: 30000 });

          collector.on('collect', m => {
            if (!triviaData.triviaScore.has(m.author.username)) return;
            if (m.content.startsWith(prefix)) return;

            const lowerCaseContent = m.content.toLowerCase();
            const lowerCaseTitle = queue[0].title.toLowerCase();
            const lowerCaseSinger = queue[0].singer.toLowerCase();

            if (lowerCaseContent === lowerCaseTitle) {
              if (songNameFound) return;
              songNameFound = true;

              if (songNameFound && songSingerFound) {
                triviaData.triviaScore.set(m.author.username, triviaData.triviaScore.get(m.author.username) + 1);
                m.react('✅');
                return collector.stop();
              }

              triviaData.triviaScore.set(m.author.username, triviaData.triviaScore.get(m.author.username) + 1);
              m.react('✅');
            } else if (lowerCaseContent === lowerCaseSinger) {
              if (songSingerFound) return;
              songSingerFound = true;

              if (songNameFound && songSingerFound) {
                triviaData.triviaScore.set(m.author.username, triviaData.triviaScore.get(m.author.username) + 1);
                m.react('✅');
                return collector.stop();
              }

              triviaData.triviaScore.set(m.author.username, triviaData.triviaScore.get(m.author.username) + 1);
              m.react('✅');
            } else if (
              lowerCaseContent === `${lowerCaseSinger} ${lowerCaseTitle}` ||
              lowerCaseContent === `${lowerCaseTitle} ${lowerCaseSinger}`
            ) {
              if ((songSingerFound && !songNameFound) || (songNameFound && !songSingerFound)) {
                triviaData.triviaScore.set(m.author.username, triviaData.triviaScore.get(m.author.username) + 1);
                m.react('✅');
                return collector.stop();
              }

              triviaData.triviaScore.set(m.author.username, triviaData.triviaScore.get(m.author.username) + 2);
              m.react('✅');
              return collector.stop();
            } else {
              return m.react('❌');
            }
          });

          collector.on('end', () => {
            if (triviaData.wasTriviaEndCalled) {
              triviaData.wasTriviaEndCalled = false;
              return;
            }

            const sortedScoreMap = new Map([...triviaData.triviaScore.entries()].sort((a, b) => b[1] - a[1]));

            const song = `${capitalize_Words(queue[0].singer)}: ${capitalize_Words(queue[0].title)}`;

            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle(`**The song was - ${song}**`)
              .setDescription(getLeaderBoard(Array.from(sortedScoreMap.entries())));

            message.channel.send(embed);

            queue.shift();
            dispatcher.end();
            return;
          });
        });

        dispatcher.on('finish', () => {
          if (queue.length >= 1) {
            return playQuizSong(queue, message);
          } else {
            if (triviaData.wasTriviaEndCalled) {
              queueConstruct.playing = false;
              triviaData.isTriviaRunning = false;
              queueConstruct.connection = null;
              message.guild.me.voice.channel.leave();
              return;
            }

            const sortedScoreMap = new Map([...triviaData.triviaScore.entries()].sort((a, b) => b[1] - a[1]));
            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle(`**Music Quiz Results\n\n**`)
              .setDescription(getLeaderBoard(Array.from(sortedScoreMap.entries())));

            message.channel.send(embed);

            queueConstruct.playing = false;
            triviaData.isTriviaRunning = false;
            triviaData.triviaScore.clear();
            queueConstruct.connection = null;
            message.guild.me.voice.channel.leave();

            return;
          }
        });
      } catch (error) {
        console.error(error);
        ops.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send("**<a:deny:892076004183506954> | Something Went Wrong!**");
      }
    }

    function getRandom(arr, n) {
      var result = new Array(n),
        len = arr.length,
        taken = new Array(len);

      if (n > len) throw new RangeError('getRandom: more elements taken than available');

      while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }

      return result;
    }

    function getLeaderBoard(arr) {
      if (!arr) return;
      let leaderBoard = '';

      leaderBoard = `👑   **${arr[0][0]}:** ${arr[0][1]}  points`;

      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          leaderBoard = leaderBoard + `\n\n   ${i + 1}: ${arr[i][0]}: ${arr[i][1]}  points`;
        }
      }

      return leaderBoard;
    }

    function capitalize_Words(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  }
};
