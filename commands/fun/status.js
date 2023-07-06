const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: "status",
    category: "fun",
    noalias: [""],
    description: "Shows the status of users",
    usage: "",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let user = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(r =>
        r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) ||
      message.guild.members.cache.find(ro =>
        ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) ||
      message.member;

    if (!user.presence.activities.length) {
      const sembed = new MessageEmbed()
        .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setThumbnail(user.user.displayAvatarURL())
        .addField("**<a:deny:892076004183506954> | No Status**", '<a:warn:891035320030724196> | This user does not have any custom status!')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      message.channel.send(sembed);
      return;
    }

    user.presence.activities.forEach((activity) => {
      if (activity.type === 'CUSTOM_STATUS') {
        const embed = new MessageEmbed()
          .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
          .setColor("RANDOM")
          .addField("**Status**", `**Custom status** -\n${activity.emoji || "No Emoji"} | ${activity.state}`)
          .setThumbnail(user.user.displayAvatarURL())
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();

        message.channel.send(embed);
      }
      else if (activity.type === 'PLAYING') {
        const embed = new MessageEmbed()
          .setAuthor(`${user.user.username}'s Activity`)
          .setColor("RANDOM")
          .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
          .addField("**Type**", "Playing")
          .addField("**App**", activity.name)
          .addField("**Details**", activity.details || "No Details")
          .addField("**Working on**", activity.state || "No Details");

        message.channel.send(embed);
      }
      else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {
        const trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
        const trackURL = `https://open.spotify.com/track/${activity.syncID}`;
        const trackName = activity.details;
        let trackAuthor = activity.state;
        const trackAlbum = activity.assets.largeText;

        trackAuthor = trackAuthor.replace(/;/g, ",");

        const embed = new MessageEmbed()
          .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
          .setColor("RANDOM")
          .setThumbnail(trackIMG)
          .addField('Song Name', trackName, true)
          .addField('Album', trackAlbum, true)
          .addField('Author', trackAuthor, false)
          .addField('Listen to Track', trackURL, false)
          .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }));

        message.channel.send(embed);
      }
    });
  }
};
