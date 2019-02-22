const BOT_AUTH_TOKEN = process.env.BOT_AUTH_TOKEN
const AutoTraderBot = require('./autotraderBot.js').bot
const bot = new AutoTraderBot(BOT_AUTH_TOKEN)
