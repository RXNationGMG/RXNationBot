module.exports = {
  config: {
    name: "message",
    aliases: ["msg", "send"],
    category: "moderation",
    description: "Sending a message to a channel",
    usage: "<channel> <message>",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    let channel = message.mentions.channels.first();
    if (!channel) {
      return message.channel.send("<a:deny:892076004183506954> | Please mention a channel!");
    }

    let content = args.slice(1).join(" ");
    if (!content) {
      return message.channel.send("<a:deny:892076004183506954> | You must specify the message you want to send!");
    }

    try {
      await message.channel.send(`<a:check:892071687250673664> | Sent the message to ${channel}`);
      await channel.send(content);
    } catch (error) {
      console.error(error);
      return message.channel.send("<a:deny:892076004183506954> | Failed to send the message!");
    }
  },
};
