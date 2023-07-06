module.exports = (bot, message) => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your message: ', (input) => {
    rl.close();

    const messageContent = input.trim();
    if (messageContent !== '') {
      bot.channels.cache.get(message.channel.id).send(messageContent)
        .then(() => {
          console.log('Message sent successfully.');
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    } else {
      console.log('Empty message. Nothing to send.');
    }
  });
};
