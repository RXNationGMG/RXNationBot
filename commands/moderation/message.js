module.exports = {
    config: {
        name: "message",
        aliases: ["msg", "send"],
        category: "moderation",
        description: "Sending message to channel",
        usage: "<channel> <message>",
        accessableby: "Administrator"
    },
    run: async (bot, message, args) => {
        let channel = message.mentions.channels.first()
        if(!channel) {
            return message.channel.send(`<a:deny:892076004183506954> mention channel please!!!`);
        }
    
        var args = message.content.split(' ').slice(2).join(' ');
     if(!args) {
         return message.channel.send(`<a:deny:892076004183506954> you must spefic the message u want to send!`)
     }
    message.channel.send(`<a:check:892071687250673664> Sent the message to ${channel}`)
    channel.send(args)
    }
}