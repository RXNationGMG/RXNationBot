const { PREFIX } = require('../../config.js');

module.exports = async (bot) => {
  console.log(`${bot.user.username} Is Now Online!`);
  
  const totalUsers = bot.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0);
  
  const activities = [
    { text: `${bot.guilds.cache.size} servers`, type: 'PLAYING' },
    { text: `${totalUsers} users!`, type: 'WATCHING' },
    { text: 'https://rxnationgaming.cf', type: 'PLAYING' }
  ];
  
  setInterval(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    bot.user.setActivity(`${PREFIX}help | ${activity.text}`, { type: activity.type });
  }, 5000);
};
