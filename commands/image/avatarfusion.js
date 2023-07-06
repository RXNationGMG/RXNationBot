const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');

module.exports = {
  config: {
    name: 'avatarfusion',
    aliases: ['avatarfuse', 'fuseavatar'],
    category: 'image',
    usage: '[first mention | first username | first ID | first nickname] <second mention | second username | second ID | second nickname>',
    description: 'Draws A User\'s Avatar Over Other User\'s Avatar',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    const permissions = message.guild.me.permissions;
    if (!permissions.has('ATTACH_FILES')) {
      return message.channel.send('**<a:deny:892076004183506954> | Missing Permissions - [ATTACH_FILES]!**');
    }
    
    if (!args[0]) {
      return message.channel.send('**Which User Would You Like To Be The Base?**');
    }

    if (!args[1]) {
      return message.channel.send('**❓ | Which User Would You Like To Put Over The Base?**');
    }

    const base = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
      message.guild.members.cache.find(r => r.displayName === args[0].toLocaleLowerCase());

    if (!base) {
      return message.channel.send('**<a:deny:892076004183506954> | Base User Not Found!**');
    }

    const overlay = message.mentions.members.first(2)[1] ||
      message.guild.members.cache.get(args[1]) ||
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[1].toLocaleLowerCase()) ||
      message.guild.members.cache.find(r => r.displayName === args[1].toLocaleLowerCase());

    if (!overlay) {
      return message.channel.send('**<a:deny:892076004183506954> | Overlay User Not Found!**');
    }

    const baseAvatarURL = base.user.displayAvatarURL({ format: 'png', size: 512 });
    const overlayAvatarURL = overlay.user.displayAvatarURL({ format: 'png', size: 512 });

    try {
      const [baseAvatarData, overlayAvatarData] = await Promise.all([
        request.get(baseAvatarURL),
        request.get(overlayAvatarURL)
      ]);

      const [baseAvatar, overlayAvatar] = await Promise.all([
        loadImage(baseAvatarData.body),
        loadImage(overlayAvatarData.body)
      ]);

      const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
      const ctx = canvas.getContext('2d');
      ctx.globalAlpha = 0.5;
      ctx.drawImage(baseAvatar, 0, 0);
      ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);

      return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'avatarfusion.png' }] });
    } catch (err) {
      return message.channel.send(`<a:deny:892076004183506954> | Oh no, an error occurred: \`${err.message}\`. Please try again later!`);
    }
  }
};
