const { readdirSync } = require('fs');
const path = require('path');

module.exports = (bot) => {
  const eventsDir = path.join(__dirname, '..', 'events');
  const eventDirs = readdirSync(eventsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  eventDirs.forEach((dir) => {
    const eventFiles = readdirSync(path.join(eventsDir, dir))
      .filter((file) => file.endsWith('.js'));

    eventFiles.forEach((file) => {
      const eventName = file.split('.')[0];
      const eventHandler = require(path.join(eventsDir, dir, file));
      bot.on(eventName, eventHandler.bind(null, bot));
    });
  });
};
