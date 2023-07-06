const path = require('path');
const { list } = require('../../functions.js');
const sounds = require('../../JSON/soundboard.json');

module.exports = {
  config: {
    name: 'soundboard',
    aliases: ['sound'],
    category: 'fun',
    usage: `${list(sounds, 'or')}`,
    description: 'Plays a sound in a voice channel',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    if (!message.guild.me.hasPermission(['CONNECT', 'SPEAK'])) {
      return message.channel.send("**I Don't Have Permissions To Either JOIN or SPEAK!**");
    }

    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send("**<a:deny:892076004183506954> | Please Join A Voice Channel To Play Sound!**");
    }

    if (!args[0]) {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const sound = `${randomSound.toLowerCase()}.mp3`;

      try {
        const connection = await channel.join();
        if (connection) {
          connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', sound));
          if (message.channel.permissionsFor(bot.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
            await message.react('🔉');
          } else {
            connection.dispatcher.end();
            channel.leave();
            return message.channel.send("**<a:deny:892076004183506954> | Missing Permission - [ADD_REACTIONS]!**");
          }
        } else {
          return message.channel.send("**<a:deny:892076004183506954> | Could Not Join Voice Channel, Please Try Again!**");
        }
      } catch {
        return message.channel.send("**<a:deny:892076004183506954> | Something Went Wrong, Please Try Again!**");
      }
    } else {
      const selectedSound = args[0].toLowerCase();
      if (!sounds.includes(selectedSound)) {
        return message.channel.send(`**❓ | Which Sound Do You Want To Play? Either ${list(sounds, 'or')}!**`);
      }

      const sound = `${selectedSound}.mp3`;

      try {
        const connection = await channel.join();
        if (connection) {
          try {
            connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', sound));
            if (message.channel.permissionsFor(bot.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
              await message.react('🔉');
            } else {
              connection.dispatcher.end();
              channel.leave();
              return message.channel.send("**<a:deny:892076004183506954> | Missing Permission - [ADD_REACTIONS]!**");
            }
          } catch {
            return message.channel.send("**<a:deny:892076004183506954> | Something Went Wrong, Please Try Again!**");
          }
        }
      } catch {
        return message.channel.send("**<a:deny:892076004183506954> | Couldn't Join Voice Channel, Please Check My Permissions!**");
      }
    }
  }
};
