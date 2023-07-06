module.exports = {
  config: {
    name: "getinvite",
    aliases: ['getinv', 'gi'],
    category: "owner",
    description: "Generates an invitation to the server in question.",
    usage: "[ID]",
    accessableby: "Owner"
  },
  run: async (bot, message, args) => {
    const ownerIds = ['725260858028195892'];

    if (!ownerIds.includes(message.author.id)) {
      return;
    }

    if (!args[0]) {
      return message.channel.send('<a:deny:892076004183506954> | Please enter a server name.');
    }

    const guildName = args.join(' ');
    const guild = bot.guilds.cache.find((g) => g.name === guildName);

    if (!guild) {
      return message.channel.send(`<a:deny:892076004183506954> | Bot is not in a server with the name \`${guildName}\`.`);
    }

    const textChannel = guild.channels.cache.find((ch) => ch.type === 'text' && ch.permissionsFor(ch.guild.me).has('CREATE_INSTANT_INVITE'));

    if (!textChannel) {
      return message.channel.send('<a:deny:892076004183506954> | An error has occurred. Unable to create an invite.');
    }

    try {
      const invite = await textChannel.createInvite({ temporary: false, maxAge: 0 });
      message.channel.send(invite.url);
    } catch (err) {
      return message.channel.send(`<a:deny:892076004183506954> | An error has occurred while creating the invite: ${err}`);
    }
  }
};
