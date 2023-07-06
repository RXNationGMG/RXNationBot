const { MessageEmbed } = require('discord.js')
const ms = require('ms');
module.exports = {
    config: {
        name: "reroll",
        description: "Rerolling giveaway winner",
        accessableby: "Administrator",
        category: "giveaway",
        aliases: ["greroll"],
        usage: '<messagegiveawayid>'
    },
    run: async (bot, message, args) => {
       if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send('<a:deny:892076004183506954> | You need to have the manage messages permissions to reroll giveaways.');
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return message.channel.send('<a:deny:892076004183506954> | You have to specify a valid message ID!');
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    bot.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    bot.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('<a:deny:892076004183506954> | Unable to find a giveaway for `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    bot.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('<a:check:892071687250673664> | Giveaway rerolled!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('<a:deny:892076004183506954> | This giveaway is not ended!');
        } else {
            console.error(e);
            message.channel.send('<a:deny:892076004183506954> | An error occured.');
        }
    });

    }
}
