const Discord = require("discord.js");
const db = require('quick.db');

module.exports = {
  config: {
    name: "reaction-roles",
    aliases: ["reactionroles", "rr"],
    category: "moderation",
    description: "Bans the user",
    usage: "",
    accessableby: "Administrator",
  },
  run: async (bot, message, args) => {
    try {
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return message.reply(
          "<a:deny:892076004183506954> | I'm sorry, but I do not have the necessary permissions to give roles."
        );
      }

      if (!message.member.hasPermission("MANAGE_ROLES")) {
        return message.reply("<a:deny:892076004183506954> | Ayo! What do you think your doing huh!");
      }

      const prompts = [
        "What **Role** would you like to give? (use ID or mention)",
        "What **emoji** would you like users to react with? (custom emojis will not work, sorry.)",
        "What would you like the text on the **message** to be? (use `--skip` to get default text)",
        "Where would you like to send this message? (use channel name, ID, or mention)",
      ];

      const roles = await getResponses(message, prompts);

      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `\`Role:\`<@&${roles.role}>\n\`Emoji:\`${roles.emoji}\n\`Text:\`${roles.text}\n\`Channel\`${roles.channel}`
        );

      const msg = await message.channel.send("Confirm", embed);
      await msg.react("✅");
      await msg.react("❌");

      const filter = (reaction, user) =>
        ["✅", "❌"].includes(reaction.emoji.name) &&
        !user.bot &&
        user.id === message.author.id;

      const reactions = await msg.awaitReactions(filter, {
        max: 1,
        time: 60000,
        errors: ["time"],
      });

      const choice = reactions.get("✅") || reactions.get("❌");

      if (choice.emoji.name === "✅") {
        const emb = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setDescription(roles.text || `React to get <@&${roles.role}> role`);

        roles.channel.send(emb).then((msg) => {
          msg.react(roles.emoji);

          function generateRandomString(length) {
            let string = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
            let secret = "";

            for (let i = length; i > 0; i--) {
              const random = Math.floor(Math.random() * string.length);
              const char = string.charAt(random);
              string = string.replace(char, "");
              secret += char;
            }

            return secret;
          }

          const randomString = generateRandomString(24);

          roles.id = randomString;
          roles.msg = msg.id;
          roles.url = msg.url;

          db.set(`rolereactions_${message.guild.id}_${msg.id}`, roles);
        });
     } else if (choice.emoji.name === "❌") {
        message.channel.send("You cancelled the command");
      }
    } catch (error) {
      console.error(error);
    }
  },
};

async function getResponses(message, prompts) {
  let settings = {};

  for (let i = 0; i < prompts.length; i++) {
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(prompts[i]);

    await message.channel.send(embed);

    const response = await message.channel.awaitMessages(
      (m) => m.author.id === message.author.id,
      { max: 1 }
    );

    const { content } = response.first();

    if (i === 0) {
      try {
        const role =
          response.first().mentions.roles.first() ||
          message.guild.roles.cache.get(args[0]);

        settings.role = role.id;
      } catch (err) {
        throw new Error("Invalid role");
      }
    } else if (i === 1) {
      const emoji = content;

      if (isCustomEmoji(emoji)) {
        throw new Error("Invalid emoji");
      } else {
        settings.emoji = emoji;
      }
    } else if (i === 2) {
      if (content === "--skip") {
        settings.text = "";
      } else {
        settings.text = content;
      }
    } else if (i === 3) {
      const channel =
        response.first().mentions.channels.first() ||
        message.guild.channels.cache.get((r) => r.name === content) ||
        message.guild.channels.cache.get(content) ||
        message.channel;

      const channel1 = message.guild.channels.cache.get(channel.id);
      const channel2 = message.guild.channels.cache.get(message.channel.id);

      if (
        !channel1.permissionsFor(message.author).toArray().includes("SEND_MESSAGES") ||
        !channel1.permissionsFor(message.guild.me).toArray().includes("SEND_MESSAGES")
      ) {
        settings.channel = channel2;
      } else {
        settings.channel = channel1;
      }
    }
  }

  return settings;
}

function isCustomEmoji(emoji) {
  return emoji.split(":").length === 1 ? false : true;
}
