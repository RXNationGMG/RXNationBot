const request = require("node-superfetch");

module.exports = {
  config: {
    name: "tts",
    aliases: ["texttospeech"],
    category: "fun",
    usage: "rx!tts [Your Text]",
    description: "Convert Text-to-Speech",
    accessableby: "everyone"
  },
  run: async (bot, message, args, ops) => {
    if (!args[0]) {
      return message.channel.send("**<a:deny:892076004183506954> | Please Enter Something To Convert To Speech!**");
    }
    
    const text = args.join(" ");
    
    if (text.length > 1024) {
      return message.channel.send("**<a:deny:892076004183506954> | Please Enter Text Between 0 And 1024 Characters!**");
    }
    
    const voiceChannel = message.member.voice.channel;
    
    if (!voiceChannel) {
      return message.channel.send("**<a:deny:892076004183506954> | Please Join A Voice Channel First!**");
    }
    
    const permissions = voiceChannel.permissionsFor(message.client.user);
    
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "**<a:deny:892076004183506954> | Missing Permissions For The Voice Channel! - [CONNECT, SPEAK]**"
      );
    }
    
    const serverQueue = ops.queue.get(message.guild.id);
    
    if (serverQueue) {
      return message.channel.send("**<a:deny:892076004183506954> | Cannot Play TTS While Music Is Being Played!**");
    }
    
    if (!voiceChannel.joinable) {
      return message.channel.send("**<a:deny:892076004183506954> | Cannot Join Voice Channel!**");
    }
    
    if (bot.voice.connections.has(voiceChannel.guild.id)) {
      return message.channel.send("**<a:deny:892076004183506954> | I Am Already Converting The TTS!**");
    }
    
    try {
      const connection = await voiceChannel.join();
      const { url } = await request.get("http://tts.cyzon.us/tts").query({ text });
      const dispatcher = connection.play(url);
      await message.react("🔉");
      dispatcher.once("finish", () => {
        voiceChannel.leave();
      });
      dispatcher.once("error", () => {
        voiceChannel.leave();
      });
      return null;
    } catch (err) {
      console.error(err);
      voiceChannel.leave();
      return message.channel.send(
        `**<a:deny:892076004183506954> | An Error Occurred: Please Try Again Later!**`
      );
    }
  }
};
