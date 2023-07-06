const { stripIndents } = require('common-tags');
const { shuffle, verify } = require('../../functions.js');
const db = require('quick.db');

module.exports = {
  config: {
    name: 'russianroulette',
    aliases: ['rroul', 'russianroul', 'rgun'],
    category: 'games',
    usage: '[username | nickname | mention | ID]',
    description: 'Who Will Pull The Trigger And Die First? You Can Play Against Bots Too!',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    if (!args[0]) return message.channel.send('**<a:deny:892076004183506954> | Please Enter A User!**');
    const opponent = message.mentions.members.first() ||
      (await message.guild.members.fetch(args[0])) ||
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) ||
      message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());
    if (!opponent) return message.channel.send("**<a:deny:892076004183506954> | Please Enter A Valid User!**");
    if (opponent.user.id === message.author.id) return message.channel.send('**<a:deny:892076004183506954> | Cannot Play Against Yourself!**');

    ops.games.set(message.channel.id, { name: 'russian-roulette' });

    try {
      if (!opponent.user.bot) {
        await message.channel.send(`**${opponent}, Do You Accept This Challenge?**`);
        const verification = await verify(message.channel, opponent);
        if (!verification) {
          ops.games.delete(message.channel.id);
          return message.channel.send(`**Looks Like ${opponent} Doesn't Want To Play!**`);
        }
      }

      let userTurn = true;
      const gun = shuffle([true, false, false, false, false, false, false, false]);
      let round = 0;
      let winner = null;
      let quit = false;

      while (!winner) {
        const player = userTurn ? message.author : opponent;
        const notPlayer = userTurn ? opponent : message.author;

        if (gun[round]) {
          await message.channel.send(`**${player} Pulls The Trigger!**`);
          await delay(4000);
          await message.channel.send("**And Dies!**");
          await message.channel.send(`**The Winner Is ${winner}!**`);
          winner = notPlayer;
        } else {
          await message.channel.send(`**${player} Pulls The Trigger!**`);
          await delay(4000);
          await message.channel.send(stripIndents`
            **And lives...**
            ${opponent.user.bot ? '**Continue?' : `**Will You Take The Gun, ${notPlayer}?`}** \`(${8 - round - 1} Shots Left!\`)
          `);

          const keepGoing = await verify(message.channel, opponent.user.bot ? message.author : notPlayer);
          if (!keepGoing) {
            winner = opponent.user.bot ? opponent : player;
            quit = true;
          }

          round++;
          userTurn = !userTurn;
        }
      }

      db.add(`games_${opponent.id}`, 1);
      db.add(`games_${message.author.id}`, 1);
      ops.games.delete(message.channel.id);

      if (quit) return message.channel.send(`**${winner} Wins, Because Their Opponent Was A Coward!**`);
    } catch (err) {
      ops.games.delete(message.channel.id);
      throw err;
    }
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
