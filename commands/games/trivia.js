const request = require('node-superfetch');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { createCanvas, registerFont } = require('canvas');
const path = require('path');

registerFont(path.join('Korrina.otf'), { family: 'Korrina' });

module.exports = {
  config: {
    name: 'trivia',
    aliases: ['quiz', 'singletrivia', 'jeopardy'],
    category: 'games',
    usage: ' ',
    description: 'Answer A Trivia Question, Join VC While Playing For More Fun (optional)\n Inspired By The Show Jeopardy',
    accessibleby: 'everyone',
  },
  run: async (bot, message, args, ops) => {
    const current = ops.games.get(message.channel.id);
    if (current) return message.channel.send(`**Please Wait Until The Current Game of \`${current.name}\` is Finished!**`);

    const { channel } = message.member.voice;
    try {
      ops.games.set(message.channel.id, { name: 'trivia' });
      const question = await fetchQuestion();
      const clueCard = await generateClueCard(question.question.replace(/<\/?i>/gi, ''));

      let connection;
      try {
        if (channel) {
          connection = await channel.join();
          if (connection) {
            connection.play(path.join(__dirname, '..', '..', 'assets', 'sounds', 'jeopardy.mp3'));
            if (message.channel.permissionsFor(bot.user).has('ADD_REACTIONS')) {
              await message.react('🔉');
            } else {
              return message.channel.send("**<a:deny:892076004183506954> | Missing Permissions - [ADD_REACTIONS]!**");
            }
          }
        }
      } catch {
        return message.channel.send("**<a:deny:892076004183506954> | Please Try Again - Connection Timed Out!**");
      }

      const clueCardEmbed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`The Category is - \`${question.category.title.toUpperCase()}\`!`)
        .attachFiles([new MessageAttachment(clueCard, 'clue-card.png')])
        .setImage('attachment://clue-card.png')
        .setFooter('You have 30 seconds to answer!');

      await message.channel.send(clueCardEmbed);

      const messages = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
        max: 1,
        time: 30000,
      });

      if (connection) {
        connection.dispatcher.end();
        channel.leave();
      }

      const answer = question.answer.replace(/<\/?i>/gi, '*');
      ops.games.delete(message.channel.id);

      if (!messages.size) return message.channel.send(`**Time Up, The Answer Was: \`${answer}\`!**`);

      const win = messages.first().content.toLowerCase() === answer.toLowerCase();

      if (!win) return message.channel.send(`**The Answer Was: ${answer}!**`);
      return message.channel.send('**<a:check:892071687250673664> | Correct Answer!!**');
    } catch (err) {
      console.log(err);
      ops.games.delete(message.channel.id);
      return message.channel.send('**<a:deny:892076004183506954> | Oh No, An Error Occurred, Try Again Later!**');
    }

    async function fetchQuestion() {
      const { body } = await request.get('https://jservice.io/api/random').query({ count: 1 });
      return body[0];
    }

    function wrapText(ctx, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }

      lines.push(currentLine);
      return lines;
    }

async function generateClueCard(question) {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'RANDOM';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.font = 'bold 62px Korrina';

  const lines = wrapText(ctx, question.toUpperCase(), 900);
  const lineHeight = 62;
  const maxLines = 4; // Maximum number of lines to display

  if (lines.length > maxLines) {
    lines.splice(maxLines, lines.length - maxLines);
    lines.push('...'); // Add ellipsis for truncated text
  }

  const totalHeight = lines.length * lineHeight;
  const initialY = (canvas.height - totalHeight) / 2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const textY = initialY + (lineHeight * i);
    ctx.fillStyle = 'RANDOM';
    ctx.fillText(line, canvas.width / 2, textY);
  }

  return canvas.toBuffer();
}
  },
};
