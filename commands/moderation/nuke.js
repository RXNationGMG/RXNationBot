module.exports = {
  config: {
    name: "nuke",
    aliases: [],
    category: "moderation",
    description: "Nuking channel",
    usage: "",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
      return message.channel.send(
        "<a:deny:892076004183506954> | You don't have permission to nuke this channel! Required permission: `Administrator`"
      );
    }

    try {
      message.channel.send("**Nuking, please wait <a:backup:892076096084901919>**");
      
      const channel = message.channel;
      const parent = channel.parent.id;
      const position = channel.position;

      await channel.clone().then((ch) => {
        ch.setParent(parent);
        ch.setPosition(position);
        channel.delete().then(() => {
          ch.send("**This Channel Has Been Nuked!!!** \n ||https://imgur.com/LIyGeCR||");
        });
      });
    } catch (error) {
      console.error(error);
      return message.channel.send("**<a:deny:892076004183506954> | Failed to nuke the channel!**");
    }
  },
};
