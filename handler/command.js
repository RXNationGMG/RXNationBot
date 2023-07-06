const { readdirSync } = require('fs');

module.exports = (bot) => {
  const load = (dirs) => {
    const commands = readdirSync(`./commands/${dirs}/`).filter((file) => file.endsWith('.js'));
    for (const file of commands) {
      const pull = require(`../commands/${dirs}/${file}`);
      if (!pull.config || !pull.config.name) {
        console.log(`Invalid command file: ${file}`);
        continue;
      }
      bot.commands.set(pull.config.name, pull);
      if (pull.config.aliases) {
        pull.config.aliases.forEach((alias) => bot.aliases.set(alias, pull.config.name));
      }
    }
  };

  const commandDirectories = [
    'economy', 'backup', 'anime', 'fun', 'ticket', 'image', 'info',
    'moderation', 'music', 'owner', 'games', 'phone', 'giveaway'
  ];

  commandDirectories.forEach((directory) => load(directory));
};
