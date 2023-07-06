const db = require('quick.db');
const { PREFIX } = require('../../config.js');
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map();

module.exports = async (bot, message) => {
  try {
    if (message.author.bot || message.channel.type === 'dm') return;

    const prefix = await db.fetch(`prefix_${message.guild.id}`) || PREFIX;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const ops = {
      queue,
      queue2,
      queue3,
      games
    };

    const command = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
    if (command) command.run(bot, message, args, ops);
  } catch (error) {
    console.log(error);
  }
};
