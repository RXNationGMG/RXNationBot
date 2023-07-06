const { delay, randomRange, verify } = require('../../functions.js');
const words = ['fire', 'draw', 'shoot', 'bang', 'pull', 'boom'];

module.exports = {
  config: {
    name: 'gunfight',
    noalias: [''],
    category: 'games',
    usage: '[mention | username | nickname | ID]',
    description: 'Engage in a gunfight against another user',
    accessableby: 'everyone',
  },

  run: async (bot, message, args, ops) => {
    if (!args[0]) return message.channel.send('**<a:deny:892076004183506954> | Please enter a user to play with!**');
    
    const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());
    
    if (!opponent) return message.channel.send('**<a:deny:892076004183506954> | Please enter a valid user!**');
    if (opponent.user.bot) return message.channel.send('**<a:deny:892076004183506954> | Cannot fight bots!**');
    if (opponent.user.id === message.author.id) return message.channel.send('**<a:deny:892076004183506954> | Cannot fight yourself!**');
    
    const current = ops.games.get(message.channel.id);
    if (current) return message.channel.send(`**Please wait until the current game of \`${current.name}\` is finished!**`);
    
    ops.games.set(message.channel.id, { name: 'gunfight' });
    
    try {
      await message.channel.send(`**${opponent}, do you accept this challenge?**`);
      const verification = await verify(message.channel, opponent);
      
      if (!verification) {
        ops.games.delete(message.channel.id);
        return message.channel.send(`**Looks like ${opponent} doesn't want to play!**`);
      }
      
      await message.channel.send('**Get ready, the game will start at any moment <a:backup:892076096084901919>**');
      await delay(randomRange(1000, 10000));
      const word = words[Math.floor(Math.random() * words.length)];
      await message.channel.send(`TYPE \`${word.toUpperCase()}\` NOW!`);
      
      const filter = res => [opponent.user.id, message.author.id].includes(res.author.id) && res.content.toLowerCase() === word.toLowerCase();
      const winner = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
      });
      
      ops.games.delete(message.channel.id);
      
      if (!winner.size) return message.channel.send('**<a:warn:891035320030724196> | Nobody won!**');
      
      return message.channel.send(`**The winner is ${winner.first().author}!**`);
    } catch (err) {
      ops.games.delete(message.channel.id);
      throw err;
    }
  },
};
