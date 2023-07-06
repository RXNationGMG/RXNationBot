const { stripIndents } = require('common-tags');
const { delay } = require('../../functions.js');
const directions = ['up', 'down', 'left', 'right'];
const colors = ['red', 'blue', 'green', 'yellow'];
const fruits = ['apple', 'orange', 'pear', 'banana'];

module.exports = {
  config: {
    name: 'memory',
    noalias: [''],
    category: 'games',
    usage: '[number](1 - 20)',
    description: 'Test your memory',
    accessableby: 'everyone',
  },
  run: async (bot, message, args, ops) => {
    if (!args[0]) return message.channel.send('**❓ | How many directions do you want to have to memorize?**');
    
    let level = args[0];
    if (level < 1 || level > 20) return message.channel.send('**<a:deny:892076004183506954> | You can only select between 1 - 20!**');
    
    const current = ops.games.get(message.channel.id);
    if (current) return message.channel.send(`**<a:warn:891035320030724196> | Please wait until the current game of \`${current.name}\` is finished!**`);
    
    ops.games.set(message.channel.id, { name: 'memory' });
    
    try {
      const memorize = genArray(level);
      const memorizeDisplay = memorize.map(word => `\`${word.toUpperCase()}\``).join(' ');
      const memorizemessage = await message.channel.send(stripIndents`
        **You have 10 seconds to memorize -**
        ${memorizeDisplay}
      `);
      
      await delay(10000);
      await memorizemessage.edit('**Type what you saw, just the words!**');
      const memorizeType = memorize.join(' ');
      const messages = await message.channel.awaitMessages(res => message.author.id === res.author.id, {
        max: 1,
        time: 30000,
      });
      
      ops.games.delete(message.channel.id);
      
      if (!messages.size) return message.channel.send(`**<a:warn:891035320030724196> | Time's up! It was ${memorizeDisplay}!**`);
      
      const answer = messages.first().content.toLowerCase();
      
      if (answer !== memorizeType) return message.channel.send(`**<a:warn:891035320030724196> | You typed it wrong, it was ${memorizeDisplay}!**`);
      
      return message.channel.send('**<a:check:892071687250673664> | You won!**');
    } catch (err) {
      ops.games.delete(message.channel.id);
      throw err;
    }
  },
};

function genArray(level) {
  const sourceArr = [colors, directions, fruits][Math.floor(Math.random() * 3)];
  const arr = [];
  
  for (let i = 0; i < level; i++) {
    arr.push(sourceArr[Math.floor(Math.random() * sourceArr.length)]);
  }
  
  return arr;
}
