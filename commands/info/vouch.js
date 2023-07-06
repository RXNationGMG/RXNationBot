const ms = require("parse-ms");
const db = require('quick.db');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { PREFIX } = require('../../config.js');

module.exports = {
    config: {
        name: "vouch",
        aliases: [],
        category: 'info',
        description: 'Vouch for a user',
        usage: '[mention]',
        accessableby: 'everyone'
    },
    run: async (bot, message, args) => {
        let timeout = 43200000;
        let prefix = PREFIX;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);
        if (fetched !== null) {
            prefix = fetched;
        }
        
        let bump = await db.fetch(`cooldown_${message.author.id}`);
        if (bump !== null && timeout - (Date.now() - bump) > 0) {
            let time = ms(timeout - (Date.now() - bump));
            return message.channel.send(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`**<a:deny:892076004183506954> | You're on cooldown**\nTime Left: ${time.hours}H , ${time.minutes}M , ${time.seconds}S`)
                .setFooter(message.guild.name, message.guild.iconURL()));
        }
        
        let user = message.mentions.users.first();
        if (!user) {
            return message.channel.send(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`**${prefix}vouch @user**`)
                .setFooter(message.guild.name, message.guild.iconURL()));
        }
        
        if (user.id === message.author.id) {
            return message.channel.send(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`<a:deny:892076004183506954> | You can't vouch for yourself!`)
                .setFooter(message.guild.name, message.guild.iconURL()));
        }

        db.add(`userthanks_${user.id}`, 1);
        db.set(`cooldown_${message.author.id}`, Date.now());
        
        return message.channel.send(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`<a:check:892071687250673664> | You have successfully vouched for ${user}`)
            .setFooter(message.guild.name, message.guild.iconURL()));
    }
};
