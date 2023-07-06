const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = async (client, reaction, user) => {
  const message = reaction.message;
  const roleObject = db.fetch(`rolereactions_${message.guild.id}_${message.id}`);
  const emoji = reaction.emoji.toString();

  if (roleObject && emoji === roleObject.emoji) {
    const member = message.guild.members.cache.get(user.id);
    const role = message.guild.roles.cache.get(roleObject.role);

    if (member && role && member.roles.cache.has(role)) {
      try {
        member.roles.remove(role);
        const removed = new MessageEmbed()
          .setTitle(`❗ Removed A Role In \`${message.guild.name}\``)
          .addField('**Role**', role.name)
          .setColor('RED')
          .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));

        member.send(removed);
      } catch (error) {
        message.channel.send('Something went wrong ' + error.message);
      }
    }
  }
};
