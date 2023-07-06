const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  config: {
    name: "pay",
    noalias: [""],
    category: "economy",
    description: "Pay to Somebody",
    usage: "[mention | ID] <amount>",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      if (!args[0]) {
        return message.channel.send(
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("**<a:deny:892076004183506954> | Please Enter A User!**")
        );
      }

      const user = message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
        ) ||
        message.guild.members.cache.find(
          r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase()
        );

      if (!user) {
        return message.channel.send(
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("**<a:deny:892076004183506954> | Enter A Valid User!**")
        );
      }

      if (user.user.id === message.author.id) {
        return message.channel.send(
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("**<a:deny:892076004183506954> | You cannot pay yourself**")
        );
      }

      if (!args[1]) {
        return message.channel.send(
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("**<a:deny:892076004183506954> | Specify an amount to pay**")
        );
      }

      if (isNaN(args[1])) {
        return message.channel.send(
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("**<a:deny:892076004183506954> | Enter A Valid Amount!**")
        );
      }

      const senderBalance = db.fetch(`money_${message.author.id}`);
      if (senderBalance < args[1]) {
        return message.channel.send(
          new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("**<a:deny:892076004183506954> | You don't have that much money**")
        );
      }

      const receiverBalance = db.fetch(`money_${user.id}`);
      db.add(`money_${user.id}`, args[1]);
      db.subtract(`money_${message.author.id}`, args[1]);

      message.channel.send(
        new MessageEmbed()
          .setColor("RANDOM")
          .setDescription(
            `**You have paid ${user.displayName} ${args[1]} coins**`
          )
      );
    } catch (error) {
      console.error(error);
    }
  }
};
