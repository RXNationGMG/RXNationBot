const figlet = require('figlet');

module.exports = {
  config: {
    name: "ascii",
    category: "fun",
    noalias: "No Aliases",
    usage: "",
    description: "Sends an ASCII font",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    try {
      if (!args[0]) return message.channel.send('<a:deny:892076004183506954> | Please provide some text');

      const msg = args.join(" ");

      figlet.text(msg, function (err, data) {
        if (err) {
          console.error('Error Detected:');
          console.error(err);
          return message.channel.send('<a:deny:892076004183506954> | Something went wrong while generating ASCII text.');
        }

        if (data.length > 2000) {
          return message.channel.send('<a:deny:892076004183506954> | Please provide me a text shorter than 2000 characters.');
        }

        message.channel.send('```' + data + '```');
      });
    } catch (error) {
      console.error('Error Detected:');
      console.error(error);
      message.channel.send('<a:deny:892076004183506954> | An error occurred while generating ASCII text.');
    }
  }
};
