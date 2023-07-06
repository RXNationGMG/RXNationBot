const { MessageEmbed } = require('discord.js');
const { Aki } = require('aki-api');
const { list, verify } = require('../../functions.js');
const regions = ['person', 'object', 'animal'];

module.exports = {
  config: {
    name: 'akinator',
    aliases: ['aki', 'guesswho'],
    category: 'games',
    usage: '[person | object | animal]',
    description: 'Think About A Real or Fictional Character, I Will Try To Guess It',
    accessibleby: 'everyone'
  },
  run: async (bot, message, args, ops) => {
    if (!message.channel.permissionsFor(bot.user).has('EMBED_LINKS')) {
      return message.channel.send('**<a:deny:892076004183506954> | Missing Permissions - [EMBED_LINKS]!**');
    }

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`**❓ | What Category Do You Want To Use? Either \`${list(regions, 'or')}\`!**`);
      return message.channel.send(embed);
    }

    const stringAki = args[0].toLowerCase();
    let region;

    if (stringAki === 'person') {
      region = 'en';
    } else if (stringAki === 'object') {
      region = 'en_objects';
    } else if (stringAki === 'animal') {
      region = 'en_animals';
    } else {
      const embed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`**<a:deny:892076004183506954> | Invalid Category! Available categories are: ${list(regions, 'or')}.**`);
      return message.channel.send(embed);
    }

    const current = ops.games.get(message.channel.id);
    if (current) {
      const embed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`**<a:warn:891035320030724196> | Please Wait Until The Current Game of \`${current.name}\` is Finished!**`);
      return message.channel.send(embed);
    }

    try {
      const aki = new Aki({ region });
      let ans = null;
      let win = false;
      let timesGuessed = 0;
      let guessResetNum = 0;
      let wentBack = false;
      const guessBlacklist = [];
      ops.games.set(message.channel.id, { name: 'akinator' });

      while (timesGuessed < Infinity) {
        if (guessResetNum > 0) guessResetNum--;
        if (ans === null) {
          await aki.start();
        } else if (wentBack) {
          wentBack = false;
        } else {
          try {
            await aki.step(ans);
          } catch {
            await aki.step(ans);
          }
        }
        if (!aki.answers || aki.currentStep >= 79) {
          win = true;
          break;
        }
        const answers = aki.answers.map(answer => answer.toLowerCase());
        answers.push('end');
        if (aki.currentStep > 0) answers.push('back');
        const embed = new MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setColor('RANDOM')
          .setDescription(`**Q${aki.currentStep + 1} - ${aki.question}**\n${aki.answers.join(' | ')}${aki.currentStep > 0 ? ` | Back` : ''} | End`)
          .setFooter(`Yes/No To Confirm | Progress - ${Math.round(Number.parseInt(aki.progress, 10))}%`);
        const sentMessage = await message.channel.send(embed);

        if (aki.currentStep >= 78) {
          const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('**Is your character:**')
            .addField('👍 Yes', 'React with 👍 if the guess is correct.')
            .addField('👎 No', 'React with 👎 if the guess is incorrect.');
          await sentMessage.react('👍');
          await sentMessage.react('👎');
          const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
          const collector = sentMessage.createReactionCollector(filter, { time: 30000, max: 1 });

          collector.on('collect', async (reaction) => {
            await sentMessage.reactions.removeAll().catch(() => {});
            if (reaction.emoji.name === '👍') {
              await aki.win();
              win = true;
            } else {
              if (aki.currentStep <= 0) {
                await message.channel.send('**<a:deny:892076004183506954> | You Cannot Go Back Any Further!**');
                wentBack = true;
              } else {
                await aki.back();
                wentBack = true;
              }
            }
          });

          collector.on('end', () => {
            if (!win) {
              ops.games.delete(message.channel.id);
              message.channel.send('**Timeout!**');
            }
          });
        } else {
          const filter = m => m.author.id === message.author.id;
          const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000 });

          if (!response || !response.first()) {
            ops.games.delete(message.channel.id);
            await message.channel.send('**Timeout!**');
            break;
          }

          const answer = response.first().content.toLowerCase();

          if (answer === 'end') {
            ops.games.delete(message.channel.id);
            break;
          } else if (answer === 'back') {
            if (aki.currentStep <= 0) {
              await message.channel.send('**<a:deny:892076004183506954> | You Cannot Go Back Any Further!**');
              wentBack = true;
            } else {
              await aki.back();
              wentBack = true;
            }
          } else if (!verify(answer, answers)) {
            await message.channel.send('**<a:deny:892076004183506954> | Invalid Option! Please Try Again!**');
          } else {
            ans = answers.indexOf(answer);
            timesGuessed++;
            guessResetNum += 10;
            guessBlacklist.push(aki.answers[ans].id);
          }
        }
      }

      ops.games.delete(message.channel.id);
      if (!win) {
        const embed = new MessageEmbed()
          .setColor('RED')
          .setDescription('**<a:check:892071687250673664> | You Ended The Game!**');
        return message.channel.send(embed);
      }

      const guess = aki.answers.filter(answer => !guessBlacklist.includes(answer.id))[0];
      const embed = new MessageEmbed()
        .setTitle('I Guessed It!')
        .setColor('GREEN')
        .setDescription(`**I'm ${Math.round(Number.parseFloat(aki.progress) * 100)}% Sure The Character You Are Thinking About Is...**\n\n${guess.name}${guess.description !== null ? `\n\n**Description:**\n${guess.description}` : ''}`)
        .setImage(guess.absolute_picture_path || null);
      await message.channel.send(embed);
    } catch (err) {
      ops.games.delete(message.channel.id);
      console.error(err);
      const embed = new MessageEmbed()
        .setColor('RED')
        .setDescription('**<a:deny:892076004183506954> | Error Occurred, Please Try Again!**');
      return message.channel.send(embed);
    }
  }
};
