module.exports = {
  config: {
    name: "avatar",
    aliases: ["av"],
    category: "image",
    description: "Shows Avatar",
    usage: "[username | nickname | mention | ID](optional)",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => { 
    const user = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) ||
      message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) ||
      message.member;

    const embed = {
      title: `${user.user.username}'s Avatar`,
      color: 'RANDOM',
      image: {
        url: `${user.user.displayAvatarURL({ dynamic: true })}?size=4096`
      },
      timestamp: new Date(),
      footer: {
        text: message.guild.name,
        icon_url: message.guild.iconURL()
      }
    };

    message.channel.send({ embed });
  }
};
