const { Client, MessageAttachment, Collection, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { PREFIX, TOKEN, DBL_API_KEY } = require('./config.js');
const bot = new Client({ disableMentions: 'everyone' });
const DBL = require('dblapi.js');
const dbl = new DBL(DBL_API_KEY)
const fs = require("fs");
const db = require('quick.db');
const jimp = require('jimp');
const { Canvas } = require('canvas-constructor');
const { createCanvas, loadImage } = require('canvas')
const { GiveawaysManager } = require("discord-giveaways");
const yaml = require("js-yaml");
const { botlog } = yaml.load(fs.readFileSync("./config.yml"));
bot.phone = new Collection();
bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});
bot.on('ready', () => {
    setInterval(() => {
        dbl.postStats(bot.guilds.cache.size);
    }, 1800000);
});

bot.snipes = new Map();

bot.on('messageDelete', (message) => {
  bot.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author.tag,
    image: message.attachments.first()?.proxyURL || null
  });
});

//Ticket system handler
bot.on('messageReactionAdd', async (reaction, user) => {
  if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();

  if (user.bot) return;
  let ticketid = await db.get(`tickets_${reaction.message.guild.id}`);
  if(!ticketid) return;
  if(reaction.message.id == ticketid && reaction.emoji.name == '🎟️') {
    db.add(`ticketnumber_${reaction.message.guild.id}`, 1)
    let ticketnumber = await db.get(`ticketnumber_${reaction.message.guild.id}`)
    if (ticketnumber === null) ticketnumber = "1"
    reaction.users.remove(user);
      reaction.message.guild.channels.create(`ticket-${ticketnumber}`, { 
          permissionOverwrites: [
              {
                  id: user.id,
                  allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
              },
              {
                  id: reaction.message.guild.roles.everyone,
                  deny: ["VIEW_CHANNEL"]
              }
          ],
          type: 'text'
      }).then(async channel => {
        channel.send(`<@${user.id}>`)

        let ticketmsg = await channel.send(new Discord.MessageEmbed()
        .setTitle(`${user.username} Ticket`)
        .setDescription("Our Team Will Be With You Soon\nTo Close This Ticket React With 🔐")
        .setFooter(reaction.message.guild.name)
    );    

            ticketmsg.react('🔐')
            console.log(`${ticketmsg.id}`)
            db.set(`closeticket_${reaction.message.guild.id}_${reaction.message.author.id}`, ticketmsg.id)
      })
  }
});

bot.on("guildCreate", guild => {
    client.channels.cache.get(botlog).send(`** NEW GUILD **\n Server: ${guild.name}\n Server ID: ${guild.id}`)
});
bot.on("guildRemove", guild => {
    client.channels.cache.get(botlog).send(`** GUILD REMOVED **\n Server: ${guild.name}\n Server ID: ${guild.id}`)
});

bot.on('messageReactionAdd', async (reaction, user) => {
  if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();

  if (user.bot) return;
  let ticketid = await db.get(`closeticket_${reaction.message.guild.id}_${reaction.message.author.id}`);
  if(!ticketid) return;
  if(reaction.message.id == ticketid && reaction.emoji.name == '🔐') {
    db.add(`closedtickets_${reaction.message.guild.id}`, 1)
    let closednumber = await db.get(`closedtickets_${reaction.message.guild.id}`)
    reaction.message.channel.setName(`Closed-${closednumber}`)
    reaction.users.remove(user);
    reaction.message.channel.send(`**Ticket Closed**`)
  await  reaction.message.channel.setTopic(`Closing.`)
   reaction.message.channel.delete()
  }
});

//Level rank handler
bot.on('message', async message => {
    let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };
  
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageFetch = db.fetch(`guildMessages_${message.guild.id}`)
    if (messageFetch === null) return;

    db.add(`messages_${message.guild.id}_${message.author.id}`, 1)
    let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)

    let messages;
    if (messagefetch == 0) messages = 0; //Level 0
    else if (messagefetch == 100) messages = 100; // Level 1
    else if (messagefetch == 200) messages = 200; // Level 2
    else if (messagefetch == 300) messages = 300; // Level 3
    else if (messagefetch == 400) messages = 400; // Level 4
    else if (messagefetch == 500) messages = 500; // Level 5
    else if (messagefetch == 600) messages = 600; // Level 6
    else if (messagefetch == 700) messages = 700; // Level 7
    else if (messagefetch == 800) messages = 800; // Level 8
    else if (messagefetch == 900) messages = 900; // Level 9
    else if (messagefetch == 1000) messages = 1000; // Level 10
    else if (messagefetch == 1100) messages = 1100; // Level 11
    else if (messagefetch == 1200) messages = 1200; // Level 12
    else if (messagefetch == 1300) messages = 1300; // Level 13
    else if (messagefetch == 1400) messages = 1400; // Level 14
    else if (messagefetch == 1500) messages = 1500; // Level 15
    else if (messagefetch == 1600) messages = 1600; // Level 16
    else if (messagefetch == 1700) messages = 1700; // Level 17
    else if (messagefetch == 1800) messages = 1800; // Level 18
    else if (messagefetch == 1900) messages = 1900; // Level 19
    else if (messagefetch == 2000) messages = 2000; // Level 20
    else if (messagefetch == 2100) messages = 2100; // Level 21
    else if (messagefetch == 2200) messages = 2200; // Level 22
    else if (messagefetch == 2300) messages = 2300; // Level 23
    else if (messagefetch == 2400) messages = 2400; // Level 24
    else if (messagefetch == 2500) messages = 2500; // Level 25
    else if (messagefetch == 2600) messages = 2600; // Level 26
    else if (messagefetch == 2700) messages = 2700; // Level 27
    else if (messagefetch == 2800) messages = 2800; // Level 28
    else if (messagefetch == 2900) messages = 2900; // Level 29
    else if (messagefetch == 3000) messages = 3000; // Level 30
    else if (messagefetch == 3100) messages = 3100; // Level 31
    else if (messagefetch == 3200) messages = 3200; // Level 32
    else if (messagefetch == 3300) messages = 3300; // Level 33
    else if (messagefetch == 3400) messages = 3400; // Level 34
    else if (messagefetch == 3500) messages = 3500; // Level 35
    else if (messagefetch == 3600) messages = 3600; // Level 36
    else if (messagefetch == 3700) messages = 3700; // Level 37
    else if (messagefetch == 3800) messages = 3800; // Level 38
    else if (messagefetch == 3900) messages = 3900; // Level 39
    else if (messagefetch == 4000) messages = 4000; // Level 40
    else if (messagefetch == 4100) messages = 4100; // Level 41
    else if (messagefetch == 4200) messages = 4200; // Level 42
    else if (messagefetch == 4300) messages = 4300; // Level 43
    else if (messagefetch == 4400) messages = 4400; // Level 44
    else if (messagefetch == 4500) messages = 4500; // Level 45
    else if (messagefetch == 4600) messages = 4600; // Level 46
    else if (messagefetch == 4700) messages = 4700; // Level 47
    else if (messagefetch == 4800) messages = 4800; // Level 48
    else if (messagefetch == 4900) messages = 4900; // Level 49
    else if (messagefetch == 5000) messages = 5000; // level 50
	else if (messagefetch == 5100) messages = 5100; // level 51
	else if (messagefetch == 5200) messages = 5200; // level 52
	else if (messagefetch == 5300) messages = 5300; // level 53
	else if (messagefetch == 5400) messages = 5400; // level 54
	else if (messagefetch == 5500) messages = 5500; // level 55
	else if (messagefetch == 5600) messages = 5600; // level 56
	else if (messagefetch == 5700) messages = 5700; // level 57
	else if (messagefetch == 5800) messages = 5800; // level 58
	else if (messagefetch == 5900) messages = 5900; // level 59
	else if (messagefetch == 6000) messages = 6000; // level 60
	else if (messagefetch == 6100) messages = 6100; // level 61	
    else if (messagefetch == 6200) messages = 6200; // level 62
	else if (messagefetch == 6300) messages = 6300; // level 63
	else if (messagefetch == 6400) messages = 6400; // level 64
	else if (messagefetch == 6500) messages = 6500; // level 65
	else if (messagefetch == 6600) messages = 6600; // level 66
	else if (messagefetch == 6700) messages = 6700; // level 67	
    else if (messagefetch == 6800) messages = 6800; // level 68
    else if (messagefetch == 6900) messages = 6900; // level 69
    else if (messagefetch == 7000) messages = 7000; // level 70
    else if (messagefetch == 7100) messages = 7100; // level 71
    else if (messagefetch == 7200) messages = 7200; // level 72
    else if (messagefetch == 7300) messages = 7300; // level 73
    else if (messagefetch == 7400) messages = 7400; // level 74
    else if (messagefetch == 7500) messages = 7500; // level 75
    else if (messagefetch == 7600) messages = 7600; // level 76
    else if (messagefetch == 7700) messages = 7700; // level 77
    else if (messagefetch == 7800) messages = 7800; // level 78
    else if (messagefetch == 7900) messages = 7900; // level 79
    else if (messagefetch == 8000) messages = 8000; // level 80
    else if (messagefetch == 8100) messages = 8100; // level 81
    else if (messagefetch == 8200) messages = 8200; // level 82
    else if (messagefetch == 8300) messages = 8300; // level 83
    else if (messagefetch == 8400) messages = 8400; // level 84
    else if (messagefetch == 8500) messages = 8500; // level 85
    else if (messagefetch == 8600) messages = 8600; // level 86
    else if (messagefetch == 8700) messages = 8700; // level 87
    else if (messagefetch == 8800) messages = 8800; // level 88
    else if (messagefetch == 8900) messages = 8900; // level 89
    else if (messagefetch == 9000) messages = 9000; // level 90
    else if (messagefetch == 9100) messages = 9100; // level 91
    else if (messagefetch == 9200) messages = 9200; // level 92
    else if (messagefetch == 9300) messages = 9300; // level 93
    else if (messagefetch == 9400) messages = 9400; // level 94
    else if (messagefetch == 9500) messages = 9500; // level 95
    else if (messagefetch == 9600) messages = 9600; // level 96
    else if (messagefetch == 9700) messages = 9700; // level 97
    else if (messagefetch == 9800) messages = 9800; // level 98
    else if (messagefetch == 9900) messages = 9900; // level 99
    else if (messagefetch == 10000) messages = 10000; // level 100

    if (!isNaN(messages)) {
        db.add(`level_${message.guild.id}_${message.author.id}`, 1)
        let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

        let levelembed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`**${message.author}, You Have Leveled Up To Level ${levelfetch}**!!`)
            .setFooter(`${prefix}disablexp To Disable Level Up Messages`)
        message.channel.send(levelembed);
    };
});

//Prefix when pinged
bot.on('message', async message => {
    let prefix;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };
    try {
        if (message.mentions.has(bot.user) && !message.mentions.has(message.guild.id)) {
            return message.channel.send(`**My Prefix In This Server is - \`${prefix}\`**`)
        }
    } catch {
        return;
    };
});

//Giveaway manager
bot.on('message', async message => {
  
    try {
        const hasText = Boolean(message.content);
        const hasImage = message.attachments.size !== 0;
        const hasEmbed = message.embeds.length !== 0;
        if (message.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
        const origin = bot.phone.find(call => call.origin.id === message.channel.id);
        const recipient = bot.phone.find(call => call.recipient.id === message.channel.id);
        if (!origin && !recipient) return;
        const call = origin || recipient;
        if (!call.active) return;
        await call.send(origin ? call.recipient : call.origin, message, hasText, hasImage, hasEmbed);
    } catch {
        return;
    };
});

// Define the GiveawayManagerWithOwnDatabase class that extends GiveawaysManager
class GiveawayManagerWithOwnDatabase extends GiveawaysManager {
  // This function is called when the manager needs to get all the giveaways stored in the database
  async getAllGiveaways() {
    // Get all the giveaways from the database
    return db.get("giveaways");
  }

  // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or edited)
  async saveGiveaway(messageID, giveawayData) {
    // Add the new giveaway to the database
    db.push("giveaways", giveawayData);
    // Return true to indicate success
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database
  async editGiveaway(messageID, giveawayData) {
    // Get all the current giveaways from the database
    const giveaways = db.get("giveaways");
    // Remove the old giveaway with the given message ID
    const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
    // Push the new edited giveaway to the array
    newGiveawaysArray.push(giveawayData);
    // Save the updated array back to the database
    db.set("giveaways", newGiveawaysArray);
    // Return true to indicate success
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database
  async deleteGiveaway(messageID) {
    // Get all the current giveaways from the database
    const giveaways = db.get("giveaways");
    // Remove the giveaway with the given message ID from the array
    const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
    // Save the updated array back to the database
    db.set("giveaways", newGiveawaysArray);
    // Return true to indicate success
    return true;
  }
}

// Create an instance of the GiveawayManagerWithOwnDatabase class
const manager = new GiveawayManagerWithOwnDatabase(bot, {
  storage: false,
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    embedColor: "#FF0000",
    reaction: "🎉",
  },
});

// Set the giveaways manager for the bot
bot.giveawaysManager = manager;

// Event listeners for giveaway reactions
bot.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

bot.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} unreacted to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

//Welcome/Leave Message & Picture 
const welcomeMessages = [
  "Welcome to the server, ${member}! :D",
  "Hey there, ${member}! Welcome to the server!",
  "A warm welcome to you, ${member}!",
  "Greetings, ${member}! We're glad to have you here!",
  "Welcome aboard, ${member}! Enjoy your stay!",
  "Hello, ${member}! Welcome to our community!",
  "Welcome, ${member}! We hope you have a great time here!",
  "Hi there, ${member}! Glad to see you join us!",
  "Welcome, ${member}! Feel free to introduce yourself!",
  "Hey, ${member}! Welcome and have fun!"
];

const goodbyeMessages = [
  "${member.user.tag} has left the server. :(",
  "${member.user.tag} has departed. Farewell!",
  "Goodbye, ${member.user.tag}. We'll miss you!",
  "So long, ${member.user.tag}. Take care!",
  "Adios, ${member.user.tag}. Stay safe!",
  "Farewell, ${member.user.tag}. Wishing you the best!",
  "Auf Wiedersehen, ${member.user.tag}. Until we meet again!",
  "Goodbye, ${member.user.tag}. Thanks for being a part of our community!",
  "Sad to see you go, ${member.user.tag}. Take care and stay in touch!",
  "Goodbye, ${member.user.tag}. May your future adventures be amazing!"
];

bot.on('guildMemberAdd', async (member) => {
  const channel = await db.fetch(`welcome_${member.guild.id}`);
  if (!channel) return;

  const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
      ctx.font = `${(fontSize -= 10)}px sans-serif`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;
  };

  const canvas = createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await loadImage('./Welcome2.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

  const displayName = member.displayName;
  ctx.font = applyText(canvas, displayName);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(displayName, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png' }));
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new MessageAttachment(canvas.toBuffer(), 'Welcome2.png');
  const welcomeChannelId = channel; // Remove the hardcoded channel ID
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
  if (welcomeChannel) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    const welcomeMessage = randomMessage.replace("${member}", member);
    const embed = new MessageEmbed()
      .setColor(randomColor)
      .setDescription(welcomeMessage)
      .attachFiles(attachment)
      .setImage('attachment://Welcome2.png');
    welcomeChannel.send(embed);
  }
});

bot.on('guildMemberRemove', async (member) => {
  const channel = await db.fetch(`welcome_${member.guild.id}`);
  if (!channel) return;

  const welcomeChannelId = channel; // Remove the hardcoded channel ID
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
  if (welcomeChannel) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const randomMessage = goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)];
    const goodbyeMessage = randomMessage.replace("${member.user.tag}", member.user.tag);
    const attachment = new MessageAttachment('./goodbye.png');
    const embed = new MessageEmbed()
      .setColor(randomColor)
      .setDescription(goodbyeMessage)
      .attachFiles(attachment)
      .setImage('attachment://goodbye.png');
    welcomeChannel.send(embed);
  }
});

//To start the bot...
const express = require("express");
const app = express();

const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/app/views/index.html");
});

app.get("/dreams", (request, response) => {
  response.json(dreams);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

bot.login(TOKEN);