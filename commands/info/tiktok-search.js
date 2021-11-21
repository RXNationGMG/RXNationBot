const Discord = require("discord.js");
const TikTok = require("tiktok-search");

module.exports = {
    config: {
        name: "tiktok-search",
        noalias: "",
        category: "info",
        description: "Shows tiktok accounts statistics",
        usage: "[username]",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
	if (!args[0]) {
        return message.channel.send(`<a:deny:892076004183506954> **| Please provide me a valid TikTok username!**`)
    }
    TikTok.getUser(args[0])
        .then((out) => {
            console.log(out);
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({
                    dynamic: true
                }))
                .setColor("RANDOM")
                .setTitle(`${out.displayName} Tiktok Profile!`)
                .setURL(out.profile)
                .setThumbnail(out.avatars.medium)
                .setDescription(`
                    **<a:rnaraa:892072507241267310> Username :** ${out.username}
                    **<a:rnaraa:892072507241267310> Display name :** ${out.displayName}
                    **<a:followerz:902225853864366151> Followers :** ${out.followers} followers
                    **<a:followerz:902225853864366151> Following :** ${out.following} following
                    **<a:upload:902228486775799868> Uploads :** ${out.videos || 0} uploads
                    **<a:heart:902225775758036992> Hearts :** ${out.hearts || 0} :hearts:
                    **<a:privv:902231769657507860> Private :** ${out.private ? "Yes :closed_lock_with_key:" : "Nope :unlock:"}
                    **<a:verifiedz:902229933189894144> Verified :** ${out.verified ? "Yes <a:check:892071687250673664>" : "Nope <a:deny:892076004183506954>"}
                    **<:ping: Signature :** ${out.signature || "No Bio"}`)
            message.channel.send(embed)
        })
        .catch(e => {
            console.log(e)
            return message.channel.send("<a:deny:892076004183506954> **| No results were found! | This Usually Caused By A Package Error! Maybe...**");
        });
    }
}

