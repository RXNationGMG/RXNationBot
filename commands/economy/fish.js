const fishes = require('../../JSON/fishes.json');
const db = require('quick.db');
const ms = require("parse-ms");
const { randomRange } = require('../../functions.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'fish',
    aliases: ['catchfish'],
    category: 'economy',
    description: 'Catch A Fish From A Vast Ocean',
    usage: '[list | rewards] (optional)',
    acessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    let user = message.author;
    let bal = db.fetch(`money_${user.id}`);
    let fish = db.fetch(`fish_${user.id}`);

    if (!args[0]) {
      if (bal === null) bal = 0;
      if (fish === null) fish = 0;

      const fishID = Math.floor(Math.random() * 10) + 1;
      let rarity;
      if (fishID < 5) rarity = 'junk';
      else if (fishID < 8) rarity = 'common';
      else if (fishID < 9) rarity = 'uncommon';
      else if (fishID < 10) rarity = 'rare';
      else rarity = 'legendary';

      const fishData = fishes[rarity];
      const worth = randomRange(fishData.min, fishData.max);

      let timeout = 1800000;
      let fishtime = db.fetch(`fishtime_${user.id}`);

      if (fishtime !== null && timeout - (Date.now() - fishtime) > 0) {
        let time = ms(timeout - (Date.now() - fishtime));
        let timeEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(`<a:warn:891035320030724196> | You've Recently Casted A Line\n\nFish Again in ${time.minutes}m ${time.seconds}s `);
        return message.channel.send(timeEmbed);
      }

      let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`**🎣 You Cast Out Your Line And Caught A ${fishData.symbol}, I Bet It'd Sell For Around ${worth}**!`);
      message.channel.send(embed);

      db.add(`money_${user.id}`, worth);
      db.add(`fish_${user.id}`, 1);
      db.set(`fishtime_${user.id}`, Date.now());
    }

    if (args[0] === 'list' || args[0] === 'rewards') {
      let lEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`List Of Fish Names And Rewards You Can Get`)
        .setDescription(`
          \`\`\`🔧Junk      :: Max Reward: 5, Min Reward: 1
          🐟Common    :: Max Reward: 25, Min Reward: 10
          🐠Uncommon  :: Max Reward: 50, Min Reward: 18
          🦑Rare      :: Max Reward: 75, Min Reward: 30
          🐋Legendary :: Max Reward: 100, Min Reward: 50\`\`\`
          **All rewards are random within the max/min range**
        `)
        .setFooter(message.guild.name, message.guild.iconURL());
      return message.channel.send(lEmbed);
    }
  }
};
