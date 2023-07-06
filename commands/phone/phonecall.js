const PhoneCall = require('../../structures/phone/PhoneCall.js');
const db = require('quick.db');

module.exports = {
  config: {
    name: 'phonecall',
    aliases: ['phone', 'call', 'pc'],
    usage: '[channel id | channel name]',
    category: 'phone',
    description: 'Starts a phone call with a random or selected server',
    accessableby: 'everyone'
  },

  run: async (bot, message, args) => {
    let channelID = bot.channels.cache.get(args[0]);
    let phoneChannel = db.fetch(`pc_${message.guild.id}`);
    let phoneID = db.fetch('pclist');

    if (!phoneID) {
      return message.channel.send('**<a:deny:892076004183506954> | No channels are currently allowing phone calls!**');
    }

    let phoneList = phoneID
      .sort((a, b) => b.ChannelID - a.ChannelID)
      .map(r => r.ChannelID);

    if (message.channel.id !== phoneChannel) {
      return message.channel.send('**<a:deny:892076004183506954> | You can start a call only in the set phone call channel!**');
    }

    if (phoneChannel === null) {
      return message.channel.send('**<a:deny:892076004183506954> | Please set a phone call channel in your server to call somebody!**');
    }

    if (inPhoneCall(message.channel)) {
      return message.channel.send('**<a:deny:892076004183506954> | This channel is already in a phone call!**');
    }

    const channels = bot.channels.cache.filter(channel => channel.guild 
      && phoneList.includes(channel.id) == true
      && !message.guild.channels.cache.has(channel.id)
      && (channelID ? true : !inPhoneCall(channel)));

    if (message.channel.id !== phoneChannel) {
      return message.channel.send('**<a:deny:892076004183506954> | You can start a call only in the set phone call channel!**');
    }

    const inCall = bot.phone.some(call => [call.origin.id, call.recipient.id].includes(message.channel.id));

    if (inCall) {
      return message.channel.send('**<a:deny:892076004183506954> | This channel is already in a phone call!**');
    }

    if (!channels.size) {
      return message.channel.send('**<a:deny:892076004183506954> | No channels have currently allowed phone calls!**');
    }

    let channel;

    if (channelID) {
      channel = channelID;

      if (message.guild.channels.cache.has(channel.id)) {
        return message.channel.send('**<a:deny:892076004183506954> | Cannot start a phone call in the same server!**');
      }

      if (!channel || !channel.guild) {
        return message.channel.send('**<a:deny:892076004183506954> | This channel does not exist, try again!**');
      }

      if (!phoneList.includes(args[0])) {
        return message.channel.send('**<a:deny:892076004183506954> | This channel does not allow phone calls!**');
      }

      if (inPhoneCall(channel)) {
        return message.channel.send('**<a:deny:892076004183506954> |This channel is already in a call!**');
      }
    } else {
      channel = channels.random();
    }

    try {
      const id = `${message.channel.id}:${channel.id}`;
      bot.phone.set(id, new PhoneCall(bot, message.channel, channel));
      await bot.phone.get(id).start();
      return null;
    } catch (e) {
      console.log(e);
      return message.channel.send('**<a:deny:892076004183506954> | Failed to start the call, try again later!**');
    }

    function inPhoneCall(channel) {
      return bot.phone.some(call => call.origin.id === channel.id || call.recipient.id === channel.id);
    }
  }
};
