const wiki = require("wikijs").default();
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "wikipedia",
        aliases: ['wiki'],
        category: "info",
        description: "Shows results from Wikipedia",
        usage: "[query]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send("**<a:deny:892076004183506954> | Enter a query!**");
        
        let loadingMessage = await message.channel.send({
            embed: {
                color: "RANDOM",
                title: "<a:backup:892076096084901919> | Searching Wikipedia just for you...",
                description: "Please stand by...",
            },
        });
        
        try {
            const search = await wiki.search(args.join(' '));
            if (!search.results.length) {
                return loadingMessage.edit({
                    embed: {
                        color: "RANDOM",
                        title: "What was that again? 📚🤓",
                        description: "Even Wikipedia doesn't seem to know what you're talking about.",
                        footer: {
                            text: "Check for typos or try searching for something else!",
                        },
                    },
                });
            }
            
            const result = await wiki.page(search.results[0]);
            const description = await result.summary();
            
            const embeds = createEmbeds(result.raw.title, description);
            
            for (const embed of embeds) {
                await message.channel.send(embed);
            }
            
            await loadingMessage.delete();
        } catch (e) {
            console.error(e);
            loadingMessage.edit("<a:deny:892076004183506954> | The Wiki You Are Searching For Is Not Available!");
        }
    }
};

function createEmbeds(title, description) {
    const embeds = [];
    const maxLength = 2048;
    
    while (description.length > 0) {
        const content = description.slice(0, maxLength);
        description = description.slice(maxLength);
        
        const embed = new MessageEmbed()
            .setAuthor(title)
            .setColor("RANDOM")
            .setDescription(content);
        
        embeds.push(embed);
    }
    
    return embeds;
}