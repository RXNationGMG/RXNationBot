const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, reaction, user) => {
  const message = reaction.message;
  const member = message.guild.members.cache.get(user.id);
  const roleObject = db.fetch(`rolereactions_${message.guild.id}_${message.id}`);
  const starObject = db.fetch(`starboard_${message.guild.id}`);
  const emoji = reaction.emoji.toString();

  if (roleObject && emoji === roleObject.emoji) {
    const role = message.guild.roles.cache.get(roleObject.role);
    
    if (!member.roles.cache.has(role)) {
      try {
        member.roles.add(role);
        const added = new MessageEmbed()
          .setTitle(`✅ Added A Role In \`${message.guild.name}\``)
          .addField('**Role**', role.name)
          .setColor('GREEN')
          .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));
        
        member.send(added);
      } catch (error) {
        message.channel.send('Something went wrong ' + error.message);
      }
    }
  }
};
