const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'eval',
    description: 'Evaluates JavaScript code',
    accessableby: 'Bot Owner',
    category: 'owner',
    aliases: ['e'],
    usage: 'eval <input>'
  },
  run: async (bot, message, args) => {
    function clean(text) {
      if (typeof text === 'string') {
        return text
          .replace(/`/g, '`' + String.fromCharCode(8203))
          .replace(/@/g, '@' + String.fromCharCode(8203));
      } else {
        return text;
      }
    }

    const ownerIds = ['725260858028195892', '725260858028195892'];

    if (!ownerIds.includes(message.author.id)) {
      return;
    }

    try {
      const code = args.join(' ');
      let evaled = eval(code);

      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled);
      }

      message.react('✅');
      const embed = new MessageEmbed()
        .setTitle('Result')
        .setDescription('```js\n' + clean(evaled) + '\n```')
        .setFooter(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
        .setColor('RANDOM');
      message.channel.send(embed);
    } catch (err) {
      message.react('❌');
      const embed = new MessageEmbed()
        .setTitle('Result')
        .setDescription('```js\n' + clean(err) + '\n```')
        .setFooter(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
        .setColor('RANDOM');
      message.channel.send(embed);
    }
  }
};
