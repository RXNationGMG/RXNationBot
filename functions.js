const yes = ['yes', 'y', 'ye', 'yea', 'correct'];
const no = ['no', 'n', 'nah', 'nope', 'fuck off'];
const MONEY = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;

module.exports = {
  getMember(message, toFind = '') {
    toFind = toFind.toLowerCase();

    const target = message.guild.members.cache.get(toFind) ||
      (message.mentions.members && message.mentions.members.first()) ||
      message.guild.members.cache.find(member => {
        return member.displayName.toLowerCase().includes(toFind) ||
          member.user.tag.toLowerCase().includes(toFind);
      }) ||
      message.member;

    return target;
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date);
  },

  async promptMessage(message, author, time, validReactions) {
    time *= 1000;

    for (const reaction of validReactions) {
      await message.react(reaction);
    }

    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

    try {
      const collected = await message.awaitReactions(filter, { max: 1, time });
      const reaction = collected.first();
      return reaction && reaction.emoji.name;
    } catch (error) {
      return null;
    }
  },

  drawImageWithTint(ctx, image, color, x, y, width, height) {
    const { fillStyle, globalAlpha } = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = globalAlpha;
  },

  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  async verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (!user || res.author.id === user.id) &&
        (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };

    try {
      const collected = await channel.awaitMessages(filter, { max: 1, time });
      const choice = collected.first().content.toLowerCase();
      return yes.includes(choice) || extraYes.includes(choice);
    } catch (error) {
      return false;
    }
  },

  chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  },

  getWrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (const word of words) {
      if (ctx.measureText(`${line}${word}`).width < maxWidth) {
        line += `${word} `;
      } else {
        lines.push(line.trim());
        line = `${word} `;
      }
    }

    lines.push(line.trim());
    return lines;
  },

  crFormat(number) {
    const ranking = Math.log10(number) / 3 | 0;
    if (!ranking) return number.toString();
    const last = MONEY[ranking];
    const scale = Math.pow(10, ranking * 3);
    const scaled = number / scale;
    return `${scaled.toFixed(2)}${last}`;
  },

  formatNumber(number, minimumFractionDigits = 0) {
    return Number.parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits: 2
    });
  },

  list(arr, conj = 'and') {
    const len = arr.length;
    if (len === 0) return '';
    if (len === 1) return arr[0];
    return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
  },

  firstUpperCase(text, split = ' ') {
    return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
  },

  shorten(text, maxLen = 2000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
  },

  stripInvites(str, { guild = true, bot = true, text = '[redacted invite]' } = {}) {
    if (guild) str = str.replace(inviteRegex, text);
    if (bot) str = str.replace(botInvRegex, text);
    return str;
  },
};
