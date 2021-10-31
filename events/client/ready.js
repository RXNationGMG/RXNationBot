const { PREFIX } = require('../../config.js');
module.exports = async bot => {
    console.log(`${bot.user.username} is available now!`)
    let totalUsers = bot.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)
    var activities = [ `${bot.guilds.cache.size} servers`, `${totalUsers} users!`, `https://rxnationgaming.cf` ], i = 0;
    setInterval(() => bot.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "PLAYING" }),5000)
    
};
