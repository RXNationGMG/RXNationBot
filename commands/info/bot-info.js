const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');

module.exports = {
  config: {
    name: "stats",
    aliases: ['bot-info'],
    category: "info",
    description: "Shows Bot Statistics",
    usage: "",
  },
  run: async (client, message, args) => {
    const uptime = moment.duration(client.uptime);
    const days = uptime.days() === 1 ? `${uptime.days()} day` : `${uptime.days()} days`;
    const hours = uptime.hours() === 1 ? `${uptime.hours()} hour` : `${uptime.hours()} hours`;
    const clientStats = stripIndent`
      Servers   :: ${client.guilds.cache.size}
      Users     :: ${client.users.cache.size}
      Channels  :: ${client.channels.cache.size}
      WS Ping   :: ${Math.round(client.ws.ping)}ms
      Uptime    :: ${days} and ${hours}
    `;
    const { totalMemMb, usedMemMb } = await mem.info();
    const serverStats = stripIndent`
      OS        :: ${await os.oos()}
      CPU       :: ${cpu.model()}
      Cores     :: ${cpu.count()}
      CPU Usage :: ${await cpu.usage()} %
      RAM       :: ${totalMemMb} MB
      RAM Usage :: ${usedMemMb} MB 
    `;
    
    const embed = new MessageEmbed()
      .setTitle('RXNationBot\'s Statistics')
      .addField('Commands', `\`${client.commands.size}\` commands`, true)
      .addField('Aliases', `\`${client.aliases.size}\` aliases`, true)
      .addField('Client', `\`\`\`asciidoc\n${clientStats}\`\`\``)
      .addField('Server', `\`\`\`asciidoc\n${serverStats}\`\`\``)
      .addField('Links', '[Invite Me](https://discord.com/api/oauth2/authorize?client_id=818490120570929182&permissions=8&scope=bot)')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    
    message.channel.send(embed);
  }
};
