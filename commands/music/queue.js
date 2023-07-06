const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'queue',
    aliases: ["q"],
    category: "music",
    description: 'shows queued songs',
    usage: " ",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    const { channel } = message.member.voice;
    if (!channel) {
      return message.channel.send('<a:deny:892076004183506954> | I\'m sorry but you need to be in a voice channel to see the queue!');
    }
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send("**<a:deny:892076004183506954> | You have to be in the same channel with the bot!**");
    }
    const serverQueue = ops.queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send('<a:warn:891035320030724196> | **Nothing is playing in this server**');
    }
    try {
      let currentPage = 0;
      const embeds = generateQueueEmbed(message, serverQueue.songs);
      const queueEmbed = await message.channel.send(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
      await queueEmbed.react('⬅️');
      await queueEmbed.react('⏹');
      await queueEmbed.react('➡️');

      const filter = (reaction, user) => ['⬅️', '⏹', '➡️'].includes(reaction.emoji.name) && (message.author.id === user.id);
      const collector = queueEmbed.createReactionCollector(filter);

      collector.on('collect', async (reaction, user) => {
        try {
          if (reaction.emoji.name === '➡️') {
            if (currentPage < embeds.length - 1) {
              currentPage++;
              queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
            }
          } else if (reaction.emoji.name === '⬅️') {
            if (currentPage !== 0) {
              currentPage--;
              queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
            }
          } else {
            collector.stop();
            reaction.message.reactions.removeAll();
          }
          await reaction.users.remove(message.author.id);
        } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("**<a:deny:892076004183506954> | Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
        }
      });
    } catch {
      serverQueue.connection.dispatcher.end();
      return message.channel.send("**<a:deny:892076004183506954> | Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**");
    }
  }
};

function generateQueueEmbed(message, queue) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current.map(track => `${++j} - [${track.title}](${track.url})`).join('\n');
    const embed = new MessageEmbed()
      .setTitle('Song Queue\n')
      .setThumbnail(message.guild.iconURL())
      .setColor('RANDOM')
      .setDescription(`**Current Song - [${queue[0].title}](${queue[0].url})**\n\n${info}`)
      .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
}
