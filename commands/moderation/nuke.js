module.exports = {
    config: {
        name: "nuke",
        aliases: [],
        category: "moderation",
        description: "Nuking channel",
        usage: "",
        accessableby: "Administrator"
    },
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.channel.send("<a:deny:892076004183506954> You Don't Have Permission To Nuke This Channel! REQUIRED PERMISSION → `Administrator`")
        }

        message.channel.send('**Nuking please wait...**')
        
        await message.channel.clone().then

        ((ch) =>{ch.setParent(message.channel.parent.id);

        ch.setPosition(message.channel.position);

        message.channel.delete().then

        (ch.send('**This Channel Has Been Nuked!!!** \n ||https://imgur.com/LIyGeCR||'))
 
    });
    }
}