module.exports = {
  config: {
    name: 'hangup',
    category: 'phone',
    aliases: ['hungup', 'leavecall', 'endcall'],
    description: 'Hangs up the current phone call.',
    accessableby: 'everyone',
    usage: ' '
  },
  run: async (bot, message, args) => {
    const origin = bot.phone.find(call => call.origin.id === message.channel.id);
    const recipient = bot.phone.find(call => call.recipient.id === message.channel.id);
    
    if (!origin && !recipient) {
      return message.channel.send('**☎️ | This channel is not in a phone call!**');
    }
    
    const call = origin || recipient;
    
    if (!call.active) {
      return message.channel.send('**☎️ | This call is not currently active!**');
    }
    
    if (call.ownerOrigin && !bot.isOwner(message.author)) {
      return message.channel.send('**☎️ | You cannot hang up in an admin call!**');
    }
    
    const nonQuitter = message.channel.id === call.origin.id ? call.recipient : call.origin;
    await call.hangup(nonQuitter);
    return null;
  }
};
